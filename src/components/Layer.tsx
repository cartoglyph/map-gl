import React from "react";
import { useInnerLayers, useInnerMap } from "./Map";
import { updateLayer } from "@/utils/layerUtils";
import { LayerOptions } from "@/types";

type LayerProps = {
	options: mapboxgl.AnyLayer;
	beforeId?: string;
};
const Layer: React.FC<LayerProps> = ({ options, beforeId }) => {
	const [map] = useInnerMap();
	const [_layers, setLayers] = useInnerLayers();
	const prevPropsRef = React.useRef<LayerOptions>({ ...options, beforeId });
	prevPropsRef.current = { ...options, beforeId };

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

	return null;
};

export default Layer;
