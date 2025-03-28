import { StateCreator } from "zustand";
import {
  OrderedLayersSpecification,
  Map,
  SourceSpecification,
  SourcesSpecification,
} from "@/types";
import { addSource } from "@/utils/source-utils";
import { addLayer } from "@/utils/layer-utils";
import { SourceSlice } from "./source-slice";
import { LayerSlice } from "./layer-slice";

export type MapSlice = {
  /** A map reference */
  map: Map | null;
  /** Initialized a map reference */
  init: (map: Map) => void;
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
    const mapSources: SourcesSpecification = style?.sources || {};
    const mapLayers: OrderedLayersSpecification = (style?.layers || []).reduce(
      (acc, curr) => ({ ...acc, [curr.id]: curr }),
      {}
    );
    set((state) => {
      // Create map sources that were defined before the map was initialized
      Object.entries(state.sources).forEach(([id, sourceSpec]) => {
        addSource(map, id, sourceSpec as SourceSpecification);
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
