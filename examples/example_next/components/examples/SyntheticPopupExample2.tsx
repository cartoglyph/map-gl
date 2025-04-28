"use client";
import React, { useEffect, useMemo } from "react";
import {
  Map,
  Layer,
  Source,
  useSyntheticPopup,
  Popup,
} from "@cartoglyph/map-gl";

const rawCities = [
  { key: "madison", lngLat: [-89.4012, 43.0731], txt: "Where It All Began" },
  { key: "nyc", lngLat: [-74.006, 40.7128], txt: "The Big Apple" },
  { key: "chicago", lngLat: [-87.6298, 41.8781], txt: "Windy City" },
  { key: "sf", lngLat: [-122.4194, 37.7749], txt: "Bay Area" },
  { key: "austin", lngLat: [-97.7431, 30.2672], txt: "Live-Music Capital" },
  { key: "naples", lngLat: [-81.7948, 26.142], txt: "It's Florida, Man." },
] as const;

/* helper to make a GeoJSON point */
const point = (
  [lng, lat]: [number, number],
  props: Record<string, unknown>
): mapboxgl.GeoJSONFeature =>
  ({
    type: "Feature",
    geometry: { type: "Point", coordinates: [lng, lat] },
    properties: props,
    id: undefined,
    layer: undefined,
    source: "",
    sourceLayer: "",
    state: {},
  }) as any;

export default function SyntheticPopupExample() {
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
          paint: { "fill-color": "#f08", "fill-opacity": 0.4 },
        }}
      />

      <StaticCityPopups offset={10} />
    </Map>
  );
}

function StaticCityPopups({ offset }: { offset?: number }) {
  const popupInputs: any[] = useMemo(
    () =>
      rawCities.map((c) => ({
        key: c.key,
        lngLat: c.lngLat,
        features: [
          point(c.lngLat as [number, number], { city: c.key, message: c.txt }),
        ],
      })),
    []
  );

  return (
    <>
      {popupInputs.map((e) => {
        const { city, message } = e.features[0]!.properties;
        return (
          <Popup key={e.key} lngLat={e.lngLat} options={{ offset }}>
            <div className="p-3 bg-white rounded-lg shadow text-sm border">
              <div className="font-bold text-blue-700 mb-1">📍 {city}</div>
              <div className="text-gray-600">{message}</div>
            </div>
          </Popup>
        );
      })}
    </>
  );
}
