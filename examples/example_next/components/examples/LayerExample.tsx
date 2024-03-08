"use client";
import React from "react";
import { Map, useMap, Layer, Source } from "@dimapio/map-gl";

const LayerExample = () => {
  const _map = useMap("main");

  return (
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
              ["==", ["feature-state", "hover"], true],
              "#4bff2b",
              "#f08",
            ],
            "fill-opacity": 1,
          },
        }}
        hover
        hoverCursor="pointer"
      />
    </Map>
  );
};

export default LayerExample;
