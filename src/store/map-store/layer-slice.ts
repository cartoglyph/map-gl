import { StateCreator } from "zustand";
import { OrderedLayerSpecification, OrderedLayersSpecification } from "@/types";
import { MapSlice } from "./map-slice";
import { addLayer, removeLayer, updateLayer } from "@/utils/layer-utils";

export type LayerSlice = {
  /** A map of layers by id */
  layers: OrderedLayersSpecification;
  /** Add a layer to the map */
  addLayer: (layerSpec: OrderedLayerSpecification) => void;
  /** Remove a layer from the map */
  removeLayer: (layerId: string) => void;
  /** Update a layer on the map */
  updateLayer: (
    layerSpec: OrderedLayerSpecification,
    prevLayerSpec: OrderedLayerSpecification
  ) => void;
};

const createLayerSlice: StateCreator<
  LayerSlice & MapSlice,
  [],
  [],
  LayerSlice
> = (set) => ({
  layers: {},
  addLayer: (layerSpec) => {
    set(({ map, layers }) => {
      layers[layerSpec.id] = layerSpec;

      if (map) {
        addLayer(map, layerSpec);
      }

      return { layers };
    });
  },
  removeLayer: (layerId) => {
    set(({ map, layers }) => {
      delete layers[layerId];

      if (map) {
        removeLayer(map, layerId);
      }

      return { layers };
    });
  },
  updateLayer: (layerSpec, prevLayerSpec) => {
    set(({ map, layers }) => {
      layers[layerSpec.id] = layerSpec;

      // If layer id did not change, update layer
      if (layerSpec.id === prevLayerSpec.id) {
        if (map) {
          updateLayer(map, layerSpec, prevLayerSpec);
        }
        return { layers };
      }

      // If layer id changed, remove layer and add new layer with id
      console.warn(
        `Layer ID has changed (previous: '${layerSpec.id}', current: '${prevLayerSpec.id}') this can affect performance.`
      );
      delete layers[prevLayerSpec.id];
      if (map) {
        removeLayer(map, prevLayerSpec.id);
        addLayer(map, layerSpec);
      }
      return { layers };
    });
  },
});

export default createLayerSlice;
