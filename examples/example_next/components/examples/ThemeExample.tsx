"use client";
import React from "react";
import { Map, useMap, Layer, Source, BBoxTool } from "@dimapio/map-gl";
import { GeoJSONFeature } from "mapbox-gl";

const BBoxToolExample = () => {
  const map = useMap("main");
  const [isSelecting, setIsSelecting] = React.useState<boolean>(false);
  const [features, setFeatures] = React.useState<GeoJSONFeature[]>([]);
  const featureIds = React.useMemo(
    () => features.map((f) => Number(f.id)),
    [features]
  );

  return (
    <div className="relative h-full w-full">
      <div className="absolute left-1 top-1 z-10 rounded bg-white px-4 py-2 shadow">
        <h1 className="font-bold">Controls</h1>
        <button
          className="border border-gray-300 bg-gray-300 px-2 hover:bg-gray-400"
          onClick={() => setIsSelecting((prev) => !prev)}
        >
          {isSelecting ? "Disable BBox Mode" : "Enable BBox Mode"}
        </button>
      </div>
      <Map
        id="main"
        accessToken={String(process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN)}
        style={{ width: "100%", height: "100%" }}
        options={{
          zoom: 6, // starting zoom
        }}
      >
        <Source
          id="urban-areas"
          options={{
            type: "geojson",
            data: "https://docs.mapbox.com/mapbox-gl-js/assets/ne_50m_urban_areas.geojson",
            generateId: true,
          }}
        />
        <Layer
          options={{
            id: "urban-areas-fill",
            type: "fill",
            source: "urban-areas",
            layout: {},
            paint: {
              "fill-color": [
                "case",
                ["in", ["id"], ["literal", featureIds]],
                "blue",
                "#f08",
              ],
              "fill-opacity": 0.7,
            },
          }}
        />
        <BBoxTool
          disabled={!isSelecting}
          onBBox={(bbox) => {
            if (!map) return;
            const features = map.queryRenderedFeatures(bbox, {
              layers: ["urban-areas-fill"],
            });
            setFeatures(features);
          }}
        />
      </Map>
    </div>
  );
};

export default BBoxToolExample;
