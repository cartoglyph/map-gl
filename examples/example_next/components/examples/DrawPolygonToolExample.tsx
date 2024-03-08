"use client";
import React from "react";
import { Map, useMap, Layer, Source, DrawPolygonTool } from "@dimapio/map-gl";
import { FeatureCollection, Polygon } from "geojson";

const DrawPolygonToolExample = () => {
  const map = useMap("main");
  const [isDrawMode, setDrawMode] = React.useState<boolean>(false);
  const [features, setFeatures] = React.useState<FeatureCollection<Polygon>>({
    type: "FeatureCollection",
    features: [],
  });

  return (
    <div className="relative h-full w-full">
      <div className="absolute left-1 top-1 z-10 rounded bg-white px-4 py-2 shadow">
        <h1 className="font-bold">Controls</h1>
        <button
          className="border border-gray-300 bg-gray-300 px-2 hover:bg-gray-400"
          onClick={() => setDrawMode((prev) => !prev)}
        >
          {isDrawMode ? "Disable Draw Mode" : "Enable Draw Mode"}
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
            data: features,
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
              "fill-color": "#f08",
              "fill-opacity": 0.7,
            },
          }}
        />
        <DrawPolygonTool
          id="drawing"
          disabled={!isDrawMode}
          onPolygon={(polygon) =>
            setFeatures((prev) => ({
              ...prev,
              features: prev.features.concat(polygon),
            }))
          }
          onInvalid={() => window.alert("Invalid Polygon!")}
        />
      </Map>
    </div>
  );
};

export default DrawPolygonToolExample;
