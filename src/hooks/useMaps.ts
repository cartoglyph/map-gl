import { useAtom } from "jotai";
import store, { globalStore } from "@/store";

/** Get all map-gl map references */
const useMaps = () => {
  return useAtom(store.maps.mapsAtom, { store: globalStore });
};

export default useMaps;
