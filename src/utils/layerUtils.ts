import deepEqual from "./deepEqual";
import { LayerSpecification, Map, CustomLayerInterface } from "mapbox-gl";
import { OrderedLayerSpecification, OrderedLayersSpecification } from "@/types";

/** Get a `Layer` from the map or create one  */
export function createLayer(
  map: Map,
  options: OrderedLayerSpecification
): LayerSpecification | CustomLayerInterface | undefined {
  const layer = map.getLayer(options.id);
  if (layer) return layer;
  // The `source` must exist on the map
  if ("source" in options && typeof options.source === "string") {
    const source = map.getSource(options.source);
    if (!source) return;
  }
  map.addLayer(options, options.beforeId);
  return map.getLayer(options.id);
}

/** Remove a `Layer` from the map if it exists */
export function removeLayer(map: Map, options: OrderedLayerSpecification) {
  if (map.getLayer(options.id)) {
    map.removeLayer(options.id);
  }
}

/** Update a `Layer` */
export function updateLayer(
  map: Map,
  props: OrderedLayerSpecification,
  prevProps: OrderedLayerSpecification
) {
  if (props.beforeId !== prevProps.beforeId) {
    map.moveLayer(props.id, props.beforeId);
  }
  if (props.layout !== prevProps.layout) {
    const layout = props.layout || {};
    const prevLayout = prevProps.layout || {};
    for (const key in layout) {
      if (!deepEqual(layout[key], prevLayout[key])) {
        map.setLayoutProperty(props.id, key as any, layout[key]);
      }
    }
    for (const key in prevLayout) {
      if (!layout.hasOwnProperty(key)) {
        map.setLayoutProperty(props.id, key as any, undefined);
      }
    }
  }
  if (props.paint !== prevProps.paint) {
    const paint = props.paint || {};
    const prevPaint = prevProps.paint || {};
    for (const key in paint) {
      if (!deepEqual(paint[key], prevPaint[key])) {
        map.setPaintProperty(props.id, key as any, paint[key]);
      }
    }
    for (const key in prevPaint) {
      if (!paint.hasOwnProperty(key)) {
        map.setPaintProperty(props.id, key as any, undefined);
      }
    }
  }

  if (!deepEqual(props.filter, prevProps.filter)) {
    map.setFilter(props.id, props.filter);
  }
  if (
    props.minzoom &&
    props.maxzoom &&
    (props.minzoom !== prevProps.minzoom || props.maxzoom !== prevProps.maxzoom)
  ) {
    map.setLayerZoomRange(props.id, props.minzoom, props.maxzoom);
  }
}

/** Sync layers within the map */
export function syncLayers(map: Map, layers: OrderedLayersSpecification) {
  // Add map layers with expected layers
  Object.values(layers).forEach((options) => {
    createLayer(map, options);
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
