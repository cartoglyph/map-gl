"use client";

import React from "react";
import {
  Map,
  useMap,
  Layer,
  Source,
  useLayerPopup,
  useLayerEvent,
} from "@cartoglyph/map-gl";

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
  const map = useMap("main");
  const clickPopup = useLayerPopup({ offset: 12 });
  const hoverPopup = useLayerPopup({ offset: 8 });
  useLayerEvent({
    map,
    type: "click",
    layerId: "urban-areas-fill",
    callback: clickPopup.open,
  });
  useLayerEvent({
    map,
    type: "mousemove",
    layerId: "urban-areas-fill",
    callback: hoverPopup.open,
  });
  useLayerEvent({
    map,
    type: "mouseleave",
    layerId: "urban-areas-fill",
    callback: hoverPopup.close,
  });
  return (
    <>
      <clickPopup.Portal>
        {(e) => (
          <PopupTemplate label="CLICK" color="indigo" data={e.features[0]} />
        )}
      </clickPopup.Portal>
      <hoverPopup.Portal>
        {(e) => (
          <PopupTemplate label="HOVER" color="pink" data={e.features[0]} />
        )}
      </hoverPopup.Portal>
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
