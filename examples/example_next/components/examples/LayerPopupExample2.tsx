"use client";

import React from "react";
import { Map, Layer, Source, ClickPopup, HoverPopup } from "@cartoglyph/map-gl";

export default function LayerPopupExample() {
  return (
    <Map
      id="main"
      accessToken={String(process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN)}
      style={{ width: "100%", height: "100%" }}
      options={{ zoom: 3, center: [-98, 39] }}
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
      <Popups />
    </Map>
  );
}

const Popups = () => {
  return (
    <>
      <ClickPopup layerId="urban-areas-fill" options={{ offset: 12 }}>
        {(e) => (
          <PopupTemplate label="CLICK" color="indigo" data={e.features[0]} />
        )}
      </ClickPopup>
      <HoverPopup layerId="urban-areas-fill" options={{ offset: 8 }}>
        {(e) => (
          <PopupTemplate label="HOVER" color="pink" data={e.features[0]} />
        )}
      </HoverPopup>
    </>
  );
};
const PopupTemplate = ({
  label,
  color,
  data,
}: {
  label: string;
  color: string;
  data: any;
}) => (
  <div className="p-3 bg-white rounded-lg shadow-lg text-sm">
    <div className={`font-bold mb-1 text-${color}-700`}>I am {label}</div>
    {Object.entries(data.properties || {}).map(([key, value]) => (
      <div key={key}>
        <span className="font-medium">{key}:</span> {String(value)}
      </div>
    ))}
  </div>
);
