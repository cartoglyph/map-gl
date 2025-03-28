import mapboxgl from "mapbox-gl";
import { StateCreator } from "zustand";
import { OrderedLayersSpecification } from "@/types";
import { addSource } from "@/utils/source-utils";
import { addLayer } from "@/utils/layer-utils";
import { SourceSlice } from "./source-slice";
import { LayerSlice } from "./layer-slice";

export type MapSlice = {
  /** A map reference */
  map: mapboxgl.Map | null;
  /** Initialized a map reference */
  init: (map: mapboxgl.Map) => void;
  /** Unloads a map reference */
  unload: () => void;
};

const createMapSlice: StateCreator<
  MapSlice & SourceSlice & LayerSlice,
  [],
  [],
  MapSlice
> = (set) => ({
  map: null,
  init: (map) => {
    const style = map.getStyle();
    const mapSources: mapboxgl.SourcesSpecification = style?.sources || {};
    const mapLayers: OrderedLayersSpecification = (style?.layers || []).reduce(
      (acc, curr) => ({ ...acc, [curr.id]: curr }),
      {}
    );
    set((state) => {
      // Create map sources that were defined before the map was initialized
      Object.entries(state.sources).forEach(([id, sourceSpec]) => {
        addSource(map, id, sourceSpec as mapboxgl.SourceSpecification);
      });
      // Create map layers that were defined before the map was initialized
      Object.values(state.layers).forEach((layerSpec) => {
        addLayer(map, layerSpec);
      });
      return {
        map,
        sources: { ...state.sources, ...mapSources },
        layers: { ...state.layers, ...mapLayers },
      };
    });
  },
  unload: () => set({ map: null }),
});

export default createMapSlice;
