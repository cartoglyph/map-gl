import { useAtom } from "jotai";
import {
  innerLayersAtom,
  innerMapAtom,
  innerMapStore,
  innerSourcesAtom,
} from "./Map.store";

/** Utility to access the map reference within the map */
export function useInnerMap() {
  return useAtom(innerMapAtom, { store: innerMapStore });
}

/** Utility to access the source references within the map */
export function useInnerSources() {
  return useAtom(innerSourcesAtom, { store: innerMapStore });
}

/** Utility to access the layers references within the map */
export function useInnerLayers() {
  return useAtom(innerLayersAtom, { store: innerMapStore });
}
