import React from "react";
import { useInnerLayers, useInnerMap } from "./Map";
import { updateLayer } from "@/utils/layerUtils";
import { LayerOptions } from "@/types";
import { useLayerEvent } from "@/hooks";

type LayerProps = {
  /** Layer options from mapbox-gl */
  options: mapboxgl.AnyLayer;
  /** Id to put this layer before */
  beforeId?: string;
  /** Enables the 'hover' feature state */
  hover?: boolean;
  /** Sets the cursor when a feature is hovered */
  hoverCursor?: React.CSSProperties["cursor"];
};
const Layer: React.FC<LayerProps> = (props) => {
  const { options, beforeId, hover = false, hoverCursor } = props;
  const [map] = useInnerMap();
  const [_layers, setLayers] = useInnerLayers();
  const propsRef = React.useRef<LayerProps>(props);
  propsRef.current = props;
  const prevPropsRef = React.useRef<LayerOptions>({ ...options, beforeId });

  const hoveredFeatureIdsRef = React.useRef<Map<string | number, string>>(
    new Map()
  );

  // Handle mount
  React.useEffect(() => {
    if (!map) return;
    setLayers((prev) => ({ ...prev, [options.id]: { ...options, beforeId } }));
  }, [map]);
  // Handle unmount
  React.useEffect(() => {
    return () => {
      setLayers((prev) => {
        delete prev[options.id];
        return prev;
      });
    };
  }, []);
  // Handle update
  React.useEffect(() => {
    if (!map) return;
    updateLayer(
      map,
      options.id,
      { ...options, beforeId },
      prevPropsRef.current
    );
    prevPropsRef.current = { ...options, beforeId };
  }, [map, options, beforeId]);
  // Handle 'hover' feature state
  useLayerEvent({
    map,
    type: "mouseenter",
    layerId: options.id,
    disabled: !hover,
    callback: (e) => {
      if (!map) return;
      const features = e.features || [];
      features.forEach((feature) => {
        if (!feature.id) {
          console.warn(
            "Attempted to set the feature state of a feature with no ID"
          );
          return;
        }
        hoveredFeatureIdsRef.current.set(feature.id, feature.source);
        map.setFeatureState(
          { id: feature.id, source: feature.source },
          { hover: true }
        );
      });
    },
  });
  useLayerEvent({
    map,
    type: "mouseleave",
    layerId: options.id,
    disabled: !hover,
    callback: () => {
      if (!map) return;
      for (const [
        featureId,
        source,
      ] of hoveredFeatureIdsRef.current.entries()) {
        map.setFeatureState({ id: featureId, source }, { hover: false });
      }
      hoveredFeatureIdsRef.current.clear();
      if (hoverCursor) {
        map.getCanvas().style.cursor = "";
      }
    },
  });
  // Handle cursor
  useLayerEvent({
    map,
    type: "mouseover",
    layerId: options.id,
    disabled: !hoverCursor,
    callback: () => {
      if (!map || !propsRef.current.hoverCursor) return;
      map.getCanvas().style.cursor = propsRef.current.hoverCursor;
    },
  });

  return null;
};

export default Layer;
