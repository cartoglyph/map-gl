"use client";
import React from "react";
import {
  Map,
  useMap,
  Layer,
  Source,
  BBoxTool,
  DrawTool,
} from "@dimapio/map-gl";

const DrawToolMap = () => {
  const map = useMap("main");
  const [isDrawMode, setDrawMode] = React.useState<boolean>(false);

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
              "fill-color": "#f08",
              "fill-opacity": 0.7,
            },
          }}
        />
        <DrawTool disabled={!isDrawMode} />
      </Map>
    </div>
  );
};

export default DrawToolMap;
