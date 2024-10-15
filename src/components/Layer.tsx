import React from "react";
import { LayerOptions } from "@/types";
import { useLayerEvent } from "@/hooks";
import { useMapStore } from "@/store/mapStore";
import { LayerSpecification } from "mapbox-gl";

type LayerProps = {
  /** Layer options from mapbox-gl */
  options: LayerSpecification;
  /** Id to put this layer before */
  beforeId?: string;
  /** Enables the 'hover' feature state */
  hover?: boolean;
  /** Sets the cursor when a feature is hovered */
  hoverCursor?: React.CSSProperties["cursor"];
  /** Enabled the 'click' feature state */
  click?: boolean;
};
const Layer: React.FC<LayerProps> = (props) => {
  const { options, beforeId, hover = false, hoverCursor, click } = props;
  const mapStore = useMapStore(
    ({ addLayer, removeLayer, updateLayer, map }) => ({
      addLayer,
      removeLayer,
      updateLayer,
      map,
    })
  );

  const propsRef = React.useRef<LayerProps>(props);
  propsRef.current = props;
  const prevPropsRef = React.useRef<LayerOptions>({ ...options, beforeId });

  type FeatureIdsMap = Map<
    string | number,
    { source: string; sourceLayer: string | undefined }
  >;
  const hoveredFeatureIdsRef = React.useRef<FeatureIdsMap>(new Map());
  const clickedFeatureIdsRef = React.useRef<FeatureIdsMap>(new Map());

  const setMapboxFeatureStates = (
    featureIds: FeatureIdsMap,
    type: "hover" | "click",
    status: boolean
  ) => {
    if (!mapStore.map) return;
    for (const [featureId, opts] of featureIds.entries()) {
      mapStore.map.setFeatureState(
        {
          id: featureId,
          source: opts.source,
          sourceLayer: opts.sourceLayer,
        },
        { [type]: status }
      );
    }
  };
  // Handle mount
  React.useEffect(() => {
    mapStore.addLayer({ ...options, beforeId });

    // Handle unmount
    return () => {
      mapStore.removeLayer(options.id);
    };
  }, []);

  // Handle update
  React.useEffect(() => {
    mapStore.updateLayer({ ...options, beforeId }, prevPropsRef.current);
  }, [options, beforeId]);

  // Handle cursor
  useLayerEvent({
    map: mapStore.map,
    type: "mouseover",
    layerId: options.id,
    disabled: !hoverCursor,
    callback: () => {
      if (!mapStore.map || !propsRef.current.hoverCursor) return;
      mapStore.map.getCanvas().style.cursor = propsRef.current.hoverCursor;
    },
  });

  useLayerEvent({
    map: mapStore.map,
    type: "mouseleave",
    layerId: options.id,
    disabled: !hover,
    callback: () => {
      if (!mapStore.map) return;
      setMapboxFeatureStates(hoveredFeatureIdsRef.current, "hover", false);
      hoveredFeatureIdsRef.current.clear();
      if (hoverCursor) mapStore.map.getCanvas().style.cursor = "";
    },
  });

  useLayerEvent({
    map: mapStore.map,
    type: "mousemove",
    layerId: options.id,
    disabled: !hover,
    callback: (e) => {
      setMapboxFeatureStates(hoveredFeatureIdsRef.current, "hover", false);
      hoveredFeatureIdsRef.current.clear();
      const features = e.features || [];
      features.forEach((feature) => {
        if (feature.id === undefined) {
          console.warn(
            "🚨 Attempted to set the feature state of a feature on layer with no ID 🚨",
            "\n",
            `Source: ${feature.source}`,
            "\n",
            `Layer: ${feature?.layer?.id}`,
            "\n",
            `Properties: ${JSON.stringify(feature.properties, null, 2)}`,
            "\n",
            "Note: IDs must be set at the root of the feature."
          );
          return;
        }
        hoveredFeatureIdsRef.current.set(feature.id, {
          source: feature.source,
          sourceLayer: feature.sourceLayer,
        });
        setMapboxFeatureStates(hoveredFeatureIdsRef.current, "hover", true);
      });
    },
  });
  // Handle click
  useLayerEvent({
    map: mapStore.map,
    type: "click",
    layerId: options.id,
    disabled: !click,
    callback: (e) => {
      // Clear existing 'click' feature states
      setMapboxFeatureStates(clickedFeatureIdsRef.current, "click", false);
      clickedFeatureIdsRef.current.clear();

      // Set 'click' feature states
      const features = e.features || [];
      features.forEach((feature) => {
        if (feature.id === undefined) {
          console.warn(
            "🚨 Attempted to set the feature state of a feature on layer with no ID 🚨",
            "\n",
            `Source: ${feature.source}`,
            "\n",
            `Layer: ${feature?.layer?.id}`,
            "\n",
            `Properties: ${JSON.stringify(feature.properties, null, 2)}`,
            "\n",
            "Note: IDs must be set at the root of the feature."
          );
          return;
        }
        clickedFeatureIdsRef.current.set(feature.id, {
          source: feature.source,
          sourceLayer: feature.sourceLayer,
        });
        setMapboxFeatureStates(clickedFeatureIdsRef.current, "click", true);
      });
    },
  });

  return null;
};

export default Layer;
