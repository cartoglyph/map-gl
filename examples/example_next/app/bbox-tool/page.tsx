"use client";
import MultiselectMap from "@/components/MultiselectMap";
import { MapProvider } from "@dimapio/map-gl";

export default function BBoxToolPage() {
  return (
    <main className="h-full w-full">
      <MapProvider>
        <MultiselectMap />
      </MapProvider>
    </main>
  );
}
