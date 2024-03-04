import { createSource, removeSource } from "@/utils/sourceUtils";
import { createLayer, removeLayer } from "@/utils/layerUtils";
import { atom, createStore, useAtom } from "jotai";
import { LayerOptions } from "@/types";

/** Inner map reference store */
export const innerMapStore = createStore();

/** Inner map reference for use with children layers */
export const innerMapAtom = atom<mapboxgl.Map | null>(null);

/** Utility to access the map reference within the map */
export function useInnerMap() {
  return useAtom(innerMapAtom, { store: innerMapStore });
}

/** A record of all source references by source id within a map context */
export type Sources = Record<string, mapboxgl.AnySourceData>;

/** An atom of source references within a map context */
export const innerSourcesAtom = atom<Sources>({});

/** Utility to access the source references within the map */
export function useInnerSources() {
  return useAtom(innerSourcesAtom, { store: innerMapStore });
}

/** A record of all layer references by layer id within a map context */
export type Layers = Record<string, LayerOptions>;

/** An atom of source references within a map context */
export const innerLayersAtom = atom<Layers>({});

/** Utility to access the layers references within the map */
export function useInnerLayers() {
  return useAtom(innerLayersAtom, { store: innerMapStore });
}

/** Add/Remove sources within the map */
innerMapStore.sub(innerSourcesAtom, () => {
  const map = innerMapStore.get(innerMapAtom);
  const sources = innerMapStore.get(innerSourcesAtom);
  if (!map) return;

  // Add map sources that are from the atom
  Object.entries(sources).forEach(([id, options]) => {
    createSource(map, id, options);
  });

  // Remove map sources that do not exist in the atom
  const currentSources = map.getStyle().sources;
  const sourceIds = Object.keys(sources);
  Object.keys(currentSources).forEach((id) => {
    if (!sourceIds.includes(id)) {
      removeSource(map, id);
    }
  });
});

/** Add/Remove layers within the map */
innerMapStore.sub(innerLayersAtom, () => {
  const map = innerMapStore.get(innerMapAtom);
  const layers = innerMapStore.get(innerLayersAtom);
  if (!map) return;

  // Add map layers that are from the atom
  Object.entries(layers).forEach(([_id, { beforeId, ...options }]) => {
    createLayer(map, options, beforeId);
  });

  // Remove map sources that do not exist in the atom
  const currentLayers = map.getStyle().layers;
  const layerIds = Object.keys(layers);
  currentLayers.forEach((layer) => {
    if (!layerIds.includes(layer.id)) {
      removeLayer(map, layer);
    }
  });
});
