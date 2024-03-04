import { useAtomValue } from "jotai";
import mapboxgl from "mapbox-gl";
import store, { globalStore } from "@/store";

/** Get a map-gl map reference */
const useMap = (id: string): mapboxgl.Map | null => {
  const maps = useAtomValue(store.maps.mapsAtom, { store: globalStore });
  return maps[id] || null;
};

export default useMap;
