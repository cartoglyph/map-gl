import React from "react";
import isValidPolygon from "@turf/boolean-valid";
import {
  FeatureCollection,
  Feature,
  LineString,
  Position,
  Point,
  Polygon,
} from "geojson";
import { useLayerEvent, useMap, useMapEvent } from "@/hooks";
import Source from "./Source";
import Layer from "./Layer";
import { enableAllMapControls } from "@/utils/map-utils";

// https://docs.mapbox.com/mapbox-gl-js/example/geojson-line/
type EditPolygonToolProps = {
  id: string;
  disabled?: boolean;
  polygon: Feature<Polygon>;
  onChange: (polygon: Feature<Polygon>) => void;
  onInvalid?: () => void;
  // fillPaint?: mapboxgl.FillLayerSpecification["paint"];
  // lineLayout?: mapboxgl.FillLayerSpecification["layout"];
  // linePaint?: mapboxgl.LineLayerSpecification["paint"];
  // circlePaint?: mapboxgl.CircleLayerSpecification["paint"];
};
const DrawPolygonTool: React.FC<EditPolygonToolProps> = ({
  id,
  disabled,
  polygon,
  onChange,
  onInvalid,
}) => {
  const map = useMap();
  const editedPointRef = React.useRef<
    { ringIndex: number; coordinateIndex: number } | undefined
  >();
  const polygonPointsRef = React.useRef<FeatureCollection<Point>>();
  const polygonLinesRef = React.useRef<FeatureCollection<LineString>>();
  const polygonRef = React.useRef<Feature<Polygon>>(polygon);

  const fillSourceId = `${id}-fill-source`;
  const fillLayerId = `${id}-fill-layer`;

  const lineSourceId = `${id}-line-source`;
  const lineLayerId = `${id}-line-layer`;

  const pointSourceId = `${id}-point-source`;
  const pointLayerId = `${id}-point-layer`;

  // Convert polygon into lines and points
  React.useEffect(() => {
    if (!map) return;
    const lines: Feature<LineString>[] = [];
    const points: Feature<Point>[] = [];
    let index: number = 0;
    polygon.geometry.coordinates.forEach((ring, ringIndex) => {
      lines.push({
        type: "Feature",
        properties: {
          ringIndex,
        },
        geometry: {
          type: "LineString",
          coordinates: ring,
        },
      });
      ring.forEach((coordinates, coordinateIndex) => {
        // Skip last "joining" point that completes the polygon
        if (coordinateIndex === ring.length - 1) return;
        points.push({
          type: "Feature",
          properties: {
            ringIndex,
            coordinateIndex,
          },
          geometry: {
            type: "Point",
            coordinates,
          },
        });
        index++;
      });
    });
    polygonLinesRef.current = {
      type: "FeatureCollection",
      features: lines,
    };
    polygonPointsRef.current = {
      type: "FeatureCollection",
      features: points,
    };
    polygonRef.current = polygon;
    const lineSrc = map.getSource(lineSourceId);
    if (lineSrc && lineSrc.type === "geojson") {
      lineSrc.setData(polygonLinesRef.current);
    }
    const pointSrc = map.getSource(pointSourceId);
    if (pointSrc && pointSrc.type === "geojson") {
      pointSrc.setData(polygonPointsRef.current);
    }
    const polygonSrc = map.getSource(fillSourceId);
    if (polygonSrc && polygonSrc.type === "geojson") {
      polygonSrc.setData(polygonRef.current);
    }
  }, [map, polygon]);

  // Polygon Points - Mouse Down
  useLayerEvent({
    map,
    type: "mousedown",
    disabled,
    layerId: pointLayerId,
    callback: (e) => {
      if (!map) return;
      if (!e.features?.length) return;
      const feature = e.features[0];
      if (feature.geometry.type !== "Point") return;
      // FIXME: make this type safe
      const ringIndex = Number(feature.properties?.ringIndex);
      const coordinateIndex = Number(feature.properties?.coordinateIndex);
      editedPointRef.current = { ringIndex, coordinateIndex };

      // Send changed polygon
      enableAllMapControls(map, false);
    },
  });

  // Map - Mouse Move
  useMapEvent({
    map,
    type: "mousemove",
    disabled,
    callback: (e) => {
      if (!map) return;
      // Check if editing a point
      if (editedPointRef.current === undefined) return;
      const { ringIndex, coordinateIndex } = editedPointRef.current;
      const nextPoint = [e.lngLat.lng, e.lngLat.lat];

      // Update the points of the polygon
      const pointSrc = map.getSource(pointSourceId);
      if (!pointSrc || pointSrc.type !== "geojson") return;
      const nextPointFeatures =
        polygonPointsRef.current?.features.map((feature) => {
          if (
            Number(feature.properties?.ringIndex) === ringIndex &&
            Number(feature.properties?.coordinateIndex) === coordinateIndex
          ) {
            return {
              ...feature,
              geometry: {
                ...feature.geometry,
                coordinates: nextPoint,
              },
            };
          }
          return feature;
        }) || [];

      const polygonPoints: FeatureCollection<Point> = {
        type: "FeatureCollection",
        features: nextPointFeatures,
      };
      polygonPointsRef.current = polygonPoints;
      pointSrc.setData(polygonPoints);

      // Update the line string that connects the points
      const lineSrc = map.getSource(lineSourceId);
      if (!lineSrc || lineSrc.type !== "geojson") return;
      const nextLineString = polygonLinesRef.current?.features[0];
      if (!nextLineString) return;
      nextLineString.geometry.coordinates[coordinateIndex] = nextPoint;
      if (coordinateIndex === 0) {
        // If edited point was first within it's ring, then also update the last coordinate
        const lastCoordinateIndex =
          nextLineString.geometry.coordinates.length - 1;
        nextLineString.geometry.coordinates[lastCoordinateIndex] = nextPoint;
      }
      const polygonLines: FeatureCollection<LineString> = {
        type: "FeatureCollection",
        features: [nextLineString],
      };
      polygonLinesRef.current = polygonLines;
      lineSrc.setData(polygonLines);

      // Update the fill that connects the points
      const polygonSrc = map.getSource(fillSourceId);
      if (!polygonSrc || polygonSrc.type !== "geojson") return;
      const coordinates = polygonRef.current.geometry.coordinates;
      coordinates[ringIndex][coordinateIndex] = nextPoint;
      const polygonFill: Feature<Polygon> = {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates,
        },
      };
      polygonRef.current = polygonFill;
      polygonSrc.setData(polygonFill);
    },
  });

  // Map - Mouse Up
  useMapEvent({
    map,
    type: "mouseup",
    disabled,
    callback: (e) => {
      if (!map) return;
      // Check if editing a point
      if (editedPointRef.current === undefined) return;
      enableAllMapControls(map, true);

      const newPoint = [e.lngLat.lng, e.lngLat.lat];

      // Update the existing polygon
      const { ringIndex, coordinateIndex } = editedPointRef.current;
      const editedPolygon: Feature<Polygon> = JSON.parse(
        JSON.stringify(polygon)
      );
      editedPolygon.geometry.coordinates[ringIndex][coordinateIndex] = newPoint;
      // If edited point was first within it's ring, then also update the last coordinate
      if (coordinateIndex === 0) {
        const lastCoordinateIndex =
          editedPolygon.geometry.coordinates[ringIndex].length - 1;
        editedPolygon.geometry.coordinates[ringIndex][lastCoordinateIndex] =
          newPoint;
      }
      // Reset edited point
      editedPointRef.current = undefined;

      // Check if new polygon is valid and return
      if (isValidPolygon(editedPolygon)) {
        onChange(editedPolygon);
      } else {
        console.log(editedPolygon);
        onInvalid?.();
      }
    },
  });

  // Handle mount and unmount
  React.useEffect(() => {
    if (!map) return;

    // Set cursor
    if (!disabled) {
      map.getCanvas().style.cursor = "grab";
    }

    return () => {
      // Reset cursor
      map.getCanvas().style.cursor = "";
    };
  }, [map, disabled]);

  if (disabled) return null;
  return (
    <>
      {/** Editable Polygon Fill  */}
      <Source
        id={fillSourceId}
        options={{
          type: "geojson",
          data: polygon,
          generateId: true,
        }}
      />
      <Layer
        options={{
          id: fillLayerId,
          source: fillSourceId,
          type: "fill",
          paint: {
            "fill-color": "blue",
            "fill-opacity": 0.2,
          },
        }}
      />
      {/** Editable Polygon Points */}
      <Source
        id={pointSourceId}
        options={{
          type: "geojson",
          data: { type: "FeatureCollection", features: [] },
          generateId: true,
        }}
      />
      <Layer
        hover
        hoverCursor="pointer"
        options={{
          id: pointLayerId,
          source: pointSourceId,
          type: "circle",
          paint: {
            "circle-color": "blue",
            "circle-radius": 5,
          },
        }}
      />
      {/** Editable Polygon Line */}
      <Source
        id={lineSourceId}
        options={{
          type: "geojson",
          data: { type: "FeatureCollection", features: [] },
          generateId: true,
        }}
      />
      <Layer
        options={{
          id: lineLayerId,
          source: lineSourceId,
          type: "line",
          layout: {
            "line-cap": "round",
            "line-join": "round",
          },
          paint: {
            "line-color": "blue",
            "line-dasharray": [1, 2],
            "line-width": 2,
          },
        }}
      />
    </>
  );
};

export default DrawPolygonTool;
