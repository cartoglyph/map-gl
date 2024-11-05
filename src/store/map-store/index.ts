import { createStore } from "zustand";
import createMapSlice, { MapSlice } from "./map-slice";
import createLayerSlice, { LayerSlice } from "./layer-slice";
import createSourceSlice, { SourceSlice } from "./source-slice";

export type MapStore = MapSlice & LayerSlice & SourceSlice;

export function createMapStore() {
  return createStore<MapStore>()((...args) => ({
    ...createMapSlice(...args),
    ...createSourceSlice(...args),
    ...createLayerSlice(...args),
  }));
}
