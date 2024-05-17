"use client";

import React from "react";
import { type StoreApi } from "zustand";
import {
  type MapStore,
  createMapStore,
  MapStoreContext,
} from "@/store/mapStore";

const MapProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const storeRef = React.useRef<StoreApi<MapStore>>();

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
