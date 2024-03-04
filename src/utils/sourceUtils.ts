import mapboxgl from "mapbox-gl";

/** Get a `Source` from the map or create one  */
export function createSource(
  map: mapboxgl.Map,
  sourceId: string,
  options: mapboxgl.AnySourceData
): mapboxgl.AnySourceImpl {
  const source = map.getSource(sourceId);
  if (source) return source;
  map.addSource(sourceId, options);
  return map.getSource(sourceId);
}

/** Remove a `Source` and all dependent `Layers` from the map if they exists */
export function removeSource(map: mapboxgl.Map, sourceId: string) {
  // Get the source reference from the map
  const source = map.getSource(sourceId);
  if (!source) return;

  // Remove all layers for this source
  const layers = map.getStyle().layers;
  layers.forEach((layer) => {
    if ("source" in layer && layer.source === sourceId) {
      map.removeLayer(layer.id);
    }
  });

  // Remove the source
  map.removeSource(sourceId);
}

/** Update a `Source` */
export function updateSource(
  map: mapboxgl.Map,
  id: string,
  props: mapboxgl.AnySourceData,
  prevProps: mapboxgl.AnySourceData
) {
  const source = map.getSource(id);
  if (!source) return;

  if (source.type === "geojson" && props.type === "geojson") {
    if (props.data) {
      if (typeof props.data === "object") {
        if (
          props.data.type === "Feature" ||
          props.data.type === "FeatureCollection"
        ) {
          source.setData(props.data);
        }
      } else {
        source.setData(props.data);
      }
    }
  } else if (source.type === "image" && props.type === "image") {
    source.updateImage({
      url: props.url,
      coordinates: props.coordinates,
    });
  }

  if ("setUrl" in source) {
    if ("url" in props) {
      const prevUrl = "url" in prevProps ? prevProps.url : null;
      if (props.url && props.url !== prevUrl) {
        source.setUrl(props.url);
      }
    }
  }

  if ("setTiles" in source) {
    if ("tiles" in props) {
      const prevTiles = "tiles" in prevProps ? prevProps.tiles : null;
      if (props.tiles && props.tiles !== prevTiles) {
        source.setTiles(props.tiles);
      }
    }
  }
}
