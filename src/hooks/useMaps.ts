import { useGlobalStore } from "@/store/globalStore";
import { Map } from "@/types";

/** Get all map-gl map references */
const useMaps = (): Record<string, Map | undefined> => {
  const maps = useGlobalStore((store) => store.maps);
  if (maps === null) {
    throw new Error(`useMaps must be use within GlobalStoreContext`);
  }
  return maps;
};

export default useMaps;
