"use client";
import HoverMap from "@/components/HoverMap";
import { MapProvider } from "@dimapio/map-gl";

export default function HoverStylePage() {
  return (
    <main className="h-full w-full">
      <MapProvider>
        <HoverMap />
      </MapProvider>
    </main>
  );
}
