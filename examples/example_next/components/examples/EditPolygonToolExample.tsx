"use client";
import React from "react";
import { Map, useMap, EditPolygonTool } from "@cartoglyph/map-gl";
import { Feature, Polygon } from "geojson";

const initialPolygon: Feature<Polygon> = {
  type: "Feature",
  properties: {},
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [-74.9779052734381, 40.7032806109365],
        [-74.27478027343824, 40.277163388746686],
        [-75.47229003906344, 39.594837293964105],
        [-76.55993652343827, 40.344184184289475],
        [-74.96691894531327, 40.7032806109365],
        [-74.9779052734381, 40.7032806109365],
      ],
    ],
  },
};

const EditPolygonToolExample = () => {
  const map = useMap("main");
  const [isEditMode, setEditMode] = React.useState<boolean>(true);
  const [feature, setFeature] =
    React.useState<Feature<Polygon>>(initialPolygon);

  return (
    <div className="relative h-full w-full">
      <div className="absolute left-1 top-1 z-10 rounded bg-white px-4 py-2 shadow">
        <h1 className="font-bold">Controls</h1>
        <button
          className="border border-gray-300 bg-gray-300 px-2 hover:bg-gray-400"
          onClick={() => setEditMode((prev) => !prev)}
        >
          {isEditMode ? "Disable Edit Mode" : "Enable Edit Mode"}
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
        <EditPolygonTool
          id="drawing"
          disabled={!isEditMode}
          polygon={feature}
          onChange={setFeature}
          onInvalid={() => window.alert("Invalid Polygon!")}
        />
      </Map>
    </div>
  );
};

export default EditPolygonToolExample;
