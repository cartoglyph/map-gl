"use client";
import React from "react";
import { Map, useMap, Layer, Source, useLayerEvent } from "@dimapio/map-gl";

const LayerExample = () => {
  const map = useMap("main");
  const [hoverEnabled, setHoverEnabled] = React.useState<boolean>(true);
  const [id, setId] = React.useState<string>("");

  useLayerEvent({
    map,
    type: "mousemove",
    layerId: "urban-areas-fill",
    disabled: !hoverEnabled,
    callback: (e) => {
      const features = e.features || [];
      setId(String(features[0].id));
    },
  });

  return (
    <div className="relative h-full w-full">
      <div className="absolute left-1 top-1 z-10 rounded bg-white px-4 py-2 shadow min-w-[300px]">
        <h1 className="font-bold">Controls</h1>
        <button
          className="shadow h-9 px-4 py-2 rounded bg-slate-700 text-white"
          onClick={() => setHoverEnabled(!hoverEnabled)}
        >
          {hoverEnabled ? "Disable Hover" : "Enable Hover"}
        </button>
        <h1 className="font-bold">Attributes</h1>
        <span>
          <b>Last Hovered ID: </b>
          <span>{id}</span>
        </span>
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
                ["==", ["feature-state", "hover"], true],
                "#4bff2b",
                "#f08",
              ],
              "fill-opacity": 1,
            },
          }}
          {...(hoverEnabled && { hover: true, hoverCursor: "pointer" })}
        />
      </Map>
    </div>
  );
};

export default LayerExample;
