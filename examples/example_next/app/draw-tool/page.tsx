"use client";
import React from "react";
import { MapProvider } from "@dimapio/map-gl";
import DrawToolMap from "@/components/DrawToolMap";

const DrawToolPage = () => {
  return (
    <main className="h-full w-full">
      <MapProvider>
        <DrawToolMap />
      </MapProvider>
    </main>
  );
};

export default DrawToolPage;
