import { LayerOptions } from "@/types";
import deepEqual from "./deepEqual";

// TODO: Update these to combine `options` and `beforeId` with custom `LayerOptions` type
/** Get a `Layer` from the map or create one  */
export function createLayer(
  map: mapboxgl.Map,
  options: mapboxgl.LayerSpecification,
  beforeId?: string
): mapboxgl.LayerSpecification | mapboxgl.CustomLayerInterface | undefined {
  const layer = map.getLayer(options.id);
  if (layer) return layer;
  // The `source` must exist on the map
  if ("source" in options && typeof options.source === "string") {
    const source = map.getSource(options.source);
    if (!source) return;
  }
  map.addLayer(options, beforeId);
  return map.getLayer(options.id);
}

/** Remove a `Layer` from the map if it exists */
export function removeLayer(map: mapboxgl.Map, options: mapboxgl.AnyLayer) {
  if (map.getLayer(options.id)) {
    map.removeLayer(options.id);
  }
}

/** Update a `Layer` */
export function updateLayer(
  map: mapboxgl.Map,
  id: string,
  props: LayerOptions,
  prevProps: LayerOptions
) {
  const { layout = {}, paint = {}, filter, minzoom, maxzoom, beforeId } = props;

  if (beforeId !== prevProps.beforeId) {
    map.moveLayer(id, beforeId);
  }
  if (layout !== prevProps.layout) {
    const prevLayout = prevProps.layout || {};
    for (const key in layout) {
      if (!deepEqual(layout[key], prevLayout[key])) {
        map.setLayoutProperty(id, key as any, layout[key]);
      }
    }
    for (const key in prevLayout) {
      if (!layout.hasOwnProperty(key)) {
        map.setLayoutProperty(id, key as any, undefined);
      }
    }
  }
  if (paint !== prevProps.paint) {
    const prevPaint = prevProps.paint || {};
    for (const key in paint) {
      if (!deepEqual(paint[key], prevPaint[key])) {
        map.setPaintProperty(id, key as any, paint[key]);
      }
    }
    for (const key in prevPaint) {
      if (!paint.hasOwnProperty(key)) {
        map.setPaintProperty(id, key as any, undefined);
      }
    }
  }

  if (!deepEqual(filter, prevProps.filter)) {
    map.setFilter(id, filter);
  }
  if (
    minzoom &&
    maxzoom &&
    (minzoom !== prevProps.minzoom || maxzoom !== prevProps.maxzoom)
  ) {
    map.setLayerZoomRange(id, minzoom, maxzoom);
  }
}

/** Sync layers within the map */
export function syncLayers(
  map: mapboxgl.Map,
  layers: Record<string, LayerOptions>
) {
  // Add map layers with expected layers
  Object.values(layers).forEach(({ beforeId, ...options }) => {
    createLayer(map, options, beforeId);
  });

  // Remove map layers that are not expected
  const currentLayers = map.getStyle()?.layers || [];
  const layerIds = Object.keys(layers);
  currentLayers.forEach((layer) => {
    if (!layerIds.includes(layer.id)) {
      removeLayer(map, layer);
    }
  });
}
