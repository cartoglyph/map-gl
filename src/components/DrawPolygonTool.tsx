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
import { useComponentTheme, useLayerEvent, useMap, useMapEvent } from "@/hooks";
import Source from "./Source";
import Layer from "./Layer";
import {
  FillLayerSpecification,
  LineLayerSpecification,
  CircleLayerSpecification,
} from "mapbox-gl";

// https://docs.mapbox.com/mapbox-gl-js/example/geojson-line/
type DrawPolygonToolProps = {
  id: string;
  disabled?: boolean;
  onPolygon: (polygon: Feature<Polygon>) => void;
  onInvalid?: () => void;
  fillPaint?: FillLayerSpecification["paint"];
  lineLayout?: FillLayerSpecification["layout"];
  linePaint?: LineLayerSpecification["paint"];
  circlePaint?: CircleLayerSpecification["paint"];
};
const DrawPolygonTool: React.FC<DrawPolygonToolProps> = ({
  id,
  disabled,
  onPolygon,
  onInvalid,
  fillPaint,
  lineLayout,
  linePaint,
  circlePaint,
}) => {
  const map = useMap();
  const theme = useComponentTheme("DrawPolygonTool", {
    fillPaint,
    lineLayout,
    linePaint,
    circlePaint,
  });
  const pointsRef = React.useRef<Position[]>([]);
  const fillSourceId = `${id}-fill-source`;
  const fillLayerId = `${id}-fill-layer`;
  const lineSourceId = `${id}-line-source`;
  const lineLayerId = `${id}-line-layer`;
  const pointSourceId = `${id}-point-source`;
  const pointLayerId = `${id}-point-layer`;

  const setFillSource = (points: Position[]) => {
    if (!map) return;
    const src = map.getSource(fillSourceId);
    if (!src || src.type !== "geojson") return;
    const data: Feature<Polygon> = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [points],
      },
    };
    src.setData(data);
  };

  const setLineSource = (points: Position[]) => {
    if (!map) return;
    const src = map.getSource(lineSourceId);
    if (!src || src.type !== "geojson") return;
    const data: Feature<LineString> = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: points,
      },
    };
    src.setData(data);
  };

  const setPointSource = (points: Position[]) => {
    if (!map) return;
    const src = map.getSource(pointSourceId);
    if (!src || src.type !== "geojson") return;
    const data: FeatureCollection<Point> = {
      type: "FeatureCollection",
      features: points.map((coordinates, index) => {
        return {
          type: "Feature",
          properties: {
            index,
          },
          geometry: {
            type: "Point",
            coordinates,
          },
        };
      }),
    };
    src.setData(data);
  };

  // Handle mount and unmount
  React.useEffect(() => {
    if (!map) return;

    // Set cursor
    if (!disabled) {
      map.getCanvas().style.cursor = "crosshair";
    }

    return () => {
      // Reset cursor
      map.getCanvas().style.cursor = "";

      // Remove any drawing points
      pointsRef.current = [];

      // Reset drawing sources
      setLineSource([]);
      setPointSource([]);
      setFillSource([]);
    };
  }, [map, disabled]);

  // Handle 'click' on map
  useMapEvent({
    map,
    type: "click",
    disabled,
    callback: (e) => {
      if (!map) return;
      // Add point to drawing points
      const { lng, lat } = e.lngLat;
      pointsRef.current.push([lng, lat]);

      // Update drawing line source
      setLineSource(pointsRef.current);
      setFillSource([...pointsRef.current, pointsRef.current[0]]);

      // Update drawing points source
      const points = [pointsRef.current[0]];
      // If more than 1 point, show previous point
      if (pointsRef.current.length > 1) {
        points.push(pointsRef.current[pointsRef.current.length - 1]);
      }
      setPointSource(points);
    },
  });

  // Handle 'mousemove' on map
  useMapEvent({
    map,
    type: "mousemove",
    disabled,
    callback: (e) => {
      if (!map) return;
      if (!pointsRef.current.length) return;

      // Get cursor position
      const { lng, lat } = e.lngLat;

      // Update drawing sources
      setLineSource([...pointsRef.current, [lng, lat]]);
      setFillSource([...pointsRef.current, [lng, lat], pointsRef.current[0]]);
    },
  });

  // Handle 'click' on points
  useLayerEvent({
    map,
    layerId: pointLayerId,
    type: "click",
    disabled,
    callback: (e) => {
      const features = e.features || [];
      if (!features.length) return;

      // If clicked on first point, finish polygon
      if (features[0].properties?.index === 0) {
        const polygon: Feature<Polygon> = {
          type: "Feature",
          properties: {},
          geometry: {
            type: "Polygon",
            coordinates: [[...pointsRef.current, pointsRef.current[0]]],
          },
        };
        if (isValidPolygon(polygon)) {
          onPolygon(polygon);
        } else {
          onInvalid?.();
        }
      }

      // Remove any drawing points
      pointsRef.current = [];

      // Reset drawing sources
      setLineSource([]);
      setPointSource([]);
      setFillSource([]);
    },
  });

  if (disabled) return null;
  return (
    <>
      <Source
        id={fillSourceId}
        options={{
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: { type: "Polygon", coordinates: [] },
          },
        }}
      />
      <Layer
        options={{
          id: fillLayerId,
          source: fillSourceId,
          type: "fill",
          paint: theme?.fillPaint,
        }}
      />
      <Source
        id={lineSourceId}
        options={{
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: { type: "LineString", coordinates: [] },
          },
        }}
      />
      <Layer
        options={{
          id: lineLayerId,
          source: lineSourceId,
          type: "line",
          layout: theme?.lineLayout,
          paint: theme?.linePaint,
        }}
      />
      <Source
        id={pointSourceId}
        options={{
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [],
          },
        }}
      />
      <Layer
        options={{
          id: pointLayerId,
          source: pointSourceId,
          type: "circle",
          paint: theme?.circlePaint,
        }}
      />
    </>
  );
};

export default DrawPolygonTool;
