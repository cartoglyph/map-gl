import React from "react";
import { StoreApi, useStore } from "zustand";
import { MapStore } from "@/store/map-store";

export const MapStoreContext = React.createContext<StoreApi<MapStore> | null>(
  null
);

export function useMapStore<T>(selector: (store: MapStore) => T): T {
  const mapStoreContext = React.useContext(MapStoreContext);

  if (!mapStoreContext) {
    throw new Error(`useMapStore must be use within MapStoreContext`);
  }

  return useStore(mapStoreContext, selector);
}
