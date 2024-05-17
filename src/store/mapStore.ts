import React from "react";
import { StoreApi, createStore, useStore } from "zustand";
import { LayerOptions } from "@/types";
import mapboxgl from "mapbox-gl";
import { removeLayer, syncLayers } from "@/utils/layerUtils";
import { removeSource, syncSources } from "@/utils/sourceUtils";

type MapState = {
  map: mapboxgl.Map | null;
  sources: Record<string, mapboxgl.AnySourceData>;
  layers: Record<string, LayerOptions>;
};

type MapActions = {
  // Map actions
  init: (map: mapboxgl.Map) => void;
  unload: () => void;
  // Layer actions
  addLayer: (layer: LayerOptions) => void;
  removeLayer: (layerId: string) => void;
  updateLayer: (layer: LayerOptions, prevLayer: LayerOptions) => void;
  // Source actions
  addSource: (sourceId: string, source: mapboxgl.AnySourceData) => void;
  removeSource: (sourceId: string) => void;
  updateSource: (
    sourceId: string,
    source: mapboxgl.AnySourceData,
    prevSourceId: string,
    prevSource: mapboxgl.AnySourceData
  ) => void;
};

export type MapStore = MapState & MapActions;

const defaultMapState: MapState = {
  map: null,
  sources: {},
  layers: {},
};

export function createMapStore() {
  return createStore<MapStore>()((set) => ({
    ...defaultMapState,
    init: (map) => {
      const style = map.getStyle();
      const layers = style.layers.reduce(
        (acc, curr) => ({ ...acc, [curr.id]: curr }),
        {}
      );
      set((state) => ({
        map,
        sources: style.sources,
        layers: { ...state.layers, ...layers },
      }));
    },
    unload: () => set(defaultMapState),
    addLayer: (layer) => {
      set(({ map, layers }) => {
        layers[layer.id] = layer;

        // Sync layers with map
        if (map) {
          syncLayers(map, layers);
        }

        return { layers };
      });
    },
    removeLayer: (layerId) => {
      set(({ map, layers }) => {
        delete layers[layerId];

        // Sync layers with map
        if (map) {
          syncLayers(map, layers);
        }

        return { layers };
      });
    },
    updateLayer: (layer, prevLayer) => {
      set(({ map, layers }) => {
        if (layer.id !== prevLayer.id) {
          delete layers[prevLayer.id];

          // If id changed, remove old layer from map
          if (map) {
            removeLayer(map, prevLayer);
          }
        }
        layers[layer.id] = layer;

        // Sync layers with map
        if (map) {
          syncLayers(map, layers);
        }

        return { layers };
      });
    },
    addSource: (sourceId, source) => {
      set(({ map, sources }) => {
        sources[sourceId] = source;

        // Sync sources with map
        if (map) {
          syncSources(map, sources);
        }

        return { sources };
      });
    },
    removeSource: (sourceId) => {
      set(({ map, sources }) => {
        delete sources[sourceId];

        // Sync sources with map
        if (map) {
          syncSources(map, sources);
        }

        return { sources };
      });
    },
    updateSource: (sourceId, source, prevSourceId, prevSource) => {
      set(({ map, sources }) => {
        if (sourceId !== prevSourceId) {
          delete sources[prevSourceId];

          // If id changed, remove old source from map
          if (map) {
            removeSource(map, prevSourceId);
          }
        }
        sources[sourceId] = source;

        // Sync layers with map
        if (map) {
          syncSources(map, sources);
        }

        return { sources };
      });
    },
  }));
}

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
