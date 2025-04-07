import React from "react";
import { useStore } from "zustand";
import { useGlobalStore } from "@/store/globalStore";
import { MapStoreContext } from "./useMapStore";

/** Get a map-gl map reference */
const useMap = (mapId?: string): mapboxgl.Map | null => {
  const maps = useGlobalStore((store) => store.maps);
  const mapStoreContext = React.useContext(MapStoreContext);
  const map = mapStoreContext
    ? useStore(mapStoreContext, (store) => store.map)
    : null;
  if (mapId && maps && maps[mapId]) {
    return maps[mapId];
  }
  return map;
};

export default useMap;
