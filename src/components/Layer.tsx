import React from "react";
import { useInnerLayers, useInnerMap } from "./Map";
import { updateLayer } from "@/utils/layerUtils";
import { LayerOptions } from "@/types";
import { useMapEvent } from "@/hooks";

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
const Layer: React.FC<LayerProps> = ({
  options,
  beforeId,
  hover = false,
  hoverCursor,
}) => {
  const [map] = useInnerMap();
  const [_layers, setLayers] = useInnerLayers();
  const prevPropsRef = React.useRef<LayerOptions>({ ...options, beforeId });
  prevPropsRef.current = { ...options, beforeId };
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
  }, [map, options, beforeId]);
  // Handle 'hover' feature state
  useMapEvent({
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
  useMapEvent({
    map,
    type: "mouseleave",
    layerId: options.id,
    disabled: !hover,
    callback: (e) => {
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
  useMapEvent({
    map,
    type: "mouseover",
    layerId: options.id,
    disabled: !hoverCursor,
    callback: (e) => {
      if (!map || !hoverCursor) return;
      map.getCanvas().style.cursor = hoverCursor;
    },
  });

  return null;
};

export default Layer;
