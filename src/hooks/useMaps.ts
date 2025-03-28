import { useGlobalStore } from "@/store/globalStore";
import mapboxgl from "mapbox-gl";

/** Get all map-gl map references */
const useMaps = (): Record<string, mapboxgl.Map | undefined> => {
  const maps = useGlobalStore((store) => store.maps);
  if (maps === null) {
    throw new Error(`useMaps must be use within GlobalStoreContext`);
  }
  return maps;
};

export default useMaps;
