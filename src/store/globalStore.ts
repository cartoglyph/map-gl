import React from "react";
import { StoreApi, createStore, useStore } from "zustand";
import { DefaultTheme, MapTheme } from "@/theme";
import { Map as MapRef } from "mapbox-gl";

type GlobalState = {
  /** A record of all map references by id */
  maps: Record<string, MapRef | undefined>;
  /** Theme for all map-gl components */
  theme: MapTheme;
};

type GlobalActions = {
  addMap: (mapId: string, mapRef: MapRef) => void;
  removeMap: (mapId: string) => void;
};

export type GlobalStore = GlobalState & GlobalActions;

export function createGlobalStore(initState?: { theme?: MapTheme }) {
  return createStore<GlobalStore>()((set, get) => ({
    maps: {},
    theme: initState?.theme || DefaultTheme,
    addMap: (mapId, map) => {
      set({ maps: { ...get().maps, [mapId]: map } });
    },
    removeMap: (mapId) => {
      const nextMaps = { ...get().maps };
      delete nextMaps[mapId];
      set({ maps: nextMaps });
    },
  }));
}

export const GlobalStoreContext =
  React.createContext<StoreApi<GlobalStore> | null>(null);

export function useGlobalStore<T>(
  selector: (store: GlobalStore) => T
): T | null {
  const globalStoreContext = React.useContext(GlobalStoreContext);

  if (!globalStoreContext) {
    return null;
  }

  return useStore(globalStoreContext, selector);
}
