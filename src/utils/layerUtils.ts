import { LayerOptions } from "@/types";
import deepEqual from "./deepEqual";
import {
  LayerSpecification,
  Map,
  CustomLayerInterface,
  LayoutSpecification,
  PaintSpecification,
} from "mapbox-gl";

/** Get a `Layer` from the map or create one  */
export function createLayer(
  map: Map,
  options: LayerSpecification,
  beforeId?: string
): LayerSpecification | CustomLayerInterface | undefined {
  const layer = map.getLayer(options.id);
  if (layer) return layer;
  // The `source` must exist on the map to create a layer
  if ("source" in options && typeof options.source === "string") {
    const source = map.getSource(options.source);
    if (!source) return;
  }
  map.addLayer(options, beforeId);
  return map.getLayer(options.id);
}

/** Remove a `Layer` from the map if it exists */
export function removeLayer(map: Map, options: LayerSpecification) {
  if (map.getLayer(options.id)) {
    map.removeLayer(options.id);
  }
}

/** Update a `Layer` */
export function updateLayer(
  map: Map,
  id: string,
  props: LayerOptions,
  prevProps: LayerOptions
) {
  // Handle 'beforeId'
  if (props.beforeId !== prevProps.beforeId) {
    map.moveLayer(id, props.beforeId);
  }

  // Handle 'layout'
  const layout = props.layout || {};
  const prevLayout = prevProps.layout || {};
  if (layout !== layout) {
    // Create or update layout properties
    for (const key in layout) {
      if (!deepEqual(layout[key], prevLayout[key])) {
        map.setLayoutProperty(
          id,
          key as keyof LayoutSpecification,
          layout[key]
        );
      }
    }
    // Remove layout properties
    for (const key in prevLayout) {
      if (!layout.hasOwnProperty(key)) {
        map.setLayoutProperty(id, key as keyof LayoutSpecification, undefined);
      }
    }
  }

  // Handle 'paint'
  const paint = props.paint || {};
  const prevPaint = prevProps.paint || {};
  if (paint !== prevPaint) {
    // Create or update paint properties
    for (const key in paint) {
      if (!deepEqual(paint[key], prevPaint[key])) {
        map.setPaintProperty(id, key as keyof PaintSpecification, paint[key]);
      }
    }
    // Remove paint properties
    for (const key in prevPaint) {
      if (!paint.hasOwnProperty(key)) {
        map.setPaintProperty(id, key as keyof PaintSpecification, undefined);
      }
    }
  }

  // Handle 'filter'
  if (!deepEqual(props.filter, prevProps.filter)) {
    map.setFilter(id, props.filter);
  }

  // Handle 'minzoom' and 'maxzoom'
  if (
    props.minzoom &&
    props.maxzoom &&
    (props.minzoom !== prevProps.minzoom || props.maxzoom !== prevProps.maxzoom)
  ) {
    map.setLayerZoomRange(id, props.minzoom, props.maxzoom);
  }
}

/** Sync layers within the map */
export function syncLayers(map: Map, layers: Record<string, LayerOptions>) {
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
