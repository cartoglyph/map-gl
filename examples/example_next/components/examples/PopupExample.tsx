"use client";
import React from "react";
import {
  Map,
  useMap,
  Layer,
  Source,
  ClickPopup,
  HoverPopup,
} from "@cartoglyph/map-gl";

const PopupExample = () => {
  const _map = useMap("main");

  return (
    <Map
      id="main"
      accessToken={String(process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN)}
      style={{ width: "100%", height: "100%" }}
      options={{
        zoom: 8, // starting zoom
      }}
    >
      <Source
        id="urban-areas"
        options={{
          type: "geojson",
          data: "https://docs.mapbox.com/mapbox-gl-js/assets/ne_50m_urban_areas.geojson",
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
            "fill-opacity": 0.4,
          },
        }}
      />
      <ClickPopup layerId="urban-areas-fill">
        {({ features: [feature] }) => {
          console.log("click!", feature);
          return (
            <div className="flex-col">
              {Object.entries(feature.properties || {}).map(([key, value]) => (
                <div key={key}>
                  {key}: {value}
                </div>
              ))}
            </div>
          );
        }}
      </ClickPopup>
      <HoverPopup layerId="urban-areas-fill">
        {({ features: [feature] }) => {
          return (
            <div className="flex-col">
              {Object.entries(feature.properties || {}).map(([key, value]) => (
                <div key={key}>
                  {key}: {value}
                </div>
              ))}
            </div>
          );
        }}
      </HoverPopup>
    </Map>
  );
};

export default PopupExample;
