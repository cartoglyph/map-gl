"use client";
import BasicMap from "@/components/BasicMap";
import { MapProvider } from "@dimapio/map-gl";

export default function BasicMapPage() {
  return (
    <main className="h-full w-full">
      <MapProvider>
        <BasicMap />
      </MapProvider>
    </main>
  );
}
