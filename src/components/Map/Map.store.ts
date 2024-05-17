import { createSource, removeSource } from "@/utils/sourceUtils";
import { createLayer, removeLayer } from "@/utils/layerUtils";
import { LayerOptions } from "@/types";

/** Add/Remove sources within the map */
// innerMapStore.sub(innerSourcesAtom, () => {
//   const map = innerMapStore.get(innerMapAtom);
//   const sources = innerMapStore.get(innerSourcesAtom);
//   if (!map) return;

//   // Add map sources that are from the atom
//   Object.entries(sources).forEach(([id, options]) => {
//     createSource(map, id, options);
//   });

//   // Remove map sources that do not exist in the atom
//   const currentSources = map.getStyle().sources;
//   const sourceIds = Object.keys(sources);
//   Object.keys(currentSources).forEach((id) => {
//     if (!sourceIds.includes(id)) {
//       removeSource(map, id);
//     }
//   });
// });

/** Add/Remove layers within the map */
// innerMapStore.sub(innerLayersAtom, () => {
//   const map = innerMapStore.get(innerMapAtom);
//   const layers = innerMapStore.get(innerLayersAtom);
//   if (!map) return;

//   // Add map layers that are from the atom
//   Object.entries(layers).forEach(([_id, { beforeId, ...options }]) => {
//     createLayer(map, options, beforeId);
//   });

//   // Remove map sources that do not exist in the atom
//   const currentLayers = map.getStyle().layers;
//   const layerIds = Object.keys(layers);
//   currentLayers.forEach((layer) => {
//     if (!layerIds.includes(layer.id)) {
//       removeLayer(map, layer);
//     }
//   });
// });
