import React from "react";
import { Map, SourceSpecification, SourcesSpecification } from "mapbox-gl";
import { StoreApi, createStore, useStore } from "zustand";
import {
  removeLayer,
  syncLayers,
  createLayer,
  updateLayer,
} from "@/utils/layerUtils";
import {
  removeSource,
  syncSources,
  createSource,
  updateSource,
} from "@/utils/sourceUtils";
import { OrderedLayersSpecification, OrderedLayerSpecification } from "@/types";

type MapState = {
  map: Map | null;
  sources: SourcesSpecification;
  layers: OrderedLayersSpecification;
};

type MapActions = {
  // Map actions
  init: (map: Map) => void;
  unload: () => void;
  // Layer actions
  addLayer: (layer: OrderedLayerSpecification) => void;
  removeLayer: (layerId: string) => void;
  updateLayer: (
    layer: OrderedLayerSpecification,
    prevLayer: OrderedLayerSpecification
  ) => void;
  // Source actions
  addSource: (sourceId: string, source: SourceSpecification) => void;
  removeSource: (sourceId: string) => void;
  updateSource: (
    sourceId: string,
    source: SourceSpecification,
    prevSourceId: string,
    prevSource: SourceSpecification
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
      const mapSources: SourcesSpecification = style?.sources || {};
      const mapLayers: OrderedLayersSpecification = (
        style?.layers || []
      ).reduce((acc, curr) => ({ ...acc, [curr.id]: curr }), {});
      set((state) => {
        // Create map sources that were defined before the map was initialized
        Object.entries(state.sources).forEach(([id, options]) => {
          createSource(map, id, options);
        });
        // Create map layers that were defined before the map was initialized
        Object.values(state.layers).forEach((options) => {
          createLayer(map, options);
        });
        return {
          map,
          sources: { ...state.sources, ...mapSources },
          layers: { ...state.layers, ...mapLayers },
        };
      });
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
        // Check if layer id changed
        if (layer.id !== prevLayer.id) {
          delete layers[prevLayer.id];
          if (map) {
            removeLayer(map, prevLayer);
          }
        }

        // Sync layers with map
        layers[layer.id] = layer;
        if (map) {
          syncLayers(map, layers);
          updateLayer(map, layer, prevLayer);
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
        // Check if source id changed
        if (sourceId !== prevSourceId) {
          delete sources[prevSourceId];
          if (map) {
            removeSource(map, prevSourceId);
          }
        }

        // Sync layers with map
        sources[sourceId] = source;
        if (map) {
          syncSources(map, sources);
          updateSource(map, sourceId, source, prevSource);
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
