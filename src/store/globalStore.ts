import React from "react";
import { StoreApi, createStore, useStore } from "zustand";
import { DefaultTheme, MapTheme } from "@/theme";
import { Map } from "mapbox-gl";

type GlobalState = {
  /** A record of all map references by id */
  maps: Record<string, Map | null>;
  /** Theme for all map-gl components */
  theme: MapTheme;
};

type GlobalActions = {
  addMap: (mapId: string, map: Map) => void;
  removeMap: (mapId: string) => void;
};

export type GlobalStore = GlobalState & GlobalActions;

export function createGlobalStore(initState?: { theme?: MapTheme }) {
  return createStore<GlobalStore>()((set) => ({
    maps: {},
    theme: initState?.theme || DefaultTheme,
    addMap: (mapId, map) =>
      set(({ maps }) => {
        maps[mapId] = map;
        return { ...maps };
      }),
    removeMap: (mapId) =>
      set(({ maps }) => {
        delete maps[mapId];
        return { ...maps };
      }),
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
