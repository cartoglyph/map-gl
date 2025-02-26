"use client";

import React from "react";
import { type StoreApi } from "zustand";
import { type MapStore, createMapStore } from "@/store/map-store";
import { MapStoreContext } from "@/hooks/useMapStore";

const MapProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const storeRef = React.useRef<StoreApi<MapStore> | undefined>(undefined);

  if (!storeRef.current) {
    storeRef.current = createMapStore();
  }

  return (
    <MapStoreContext.Provider value={storeRef.current}>
      {children}
    </MapStoreContext.Provider>
  );
};

export default MapProvider;
