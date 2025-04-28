import deepEqual from "./deepEqual";
import { OrderedLayerSpecification } from "@/types";

/** Add a layer to the map if it does not exist then return the added layer  */
export function addLayer(
  map: mapboxgl.Map,
  options: OrderedLayerSpecification
): mapboxgl.LayerSpecification | mapboxgl.CustomLayerInterface | undefined {
  const layer = map.getLayer(options.id);
  if (layer) return layer;
  // The `source` must exist on the map
  if ("source" in options && typeof options.source === "string") {
    const source = map.getSource(options.source);
    if (!source) return;
  }
  // Check if `beforeId` layer exists on map
  let beforeId: string | undefined = undefined;
  if (options.beforeId) {
    const beforeLayer = map.getLayer(options.beforeId);
    if (beforeLayer) beforeId = options.beforeId;
  }
  map.addLayer(options, beforeId);
  return map.getLayer(options.id);
}

/** Remove a `Layer` from the map if it exists */
export function removeLayer(map: mapboxgl.Map, layerId: string) {
  if (map.getLayer(layerId)) {
    map.removeLayer(layerId);
  }
}

/** Update a `Layer` */
export function updateLayer(
  map: mapboxgl.Map,
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
