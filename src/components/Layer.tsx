import React from "react";
import { useInnerMap } from "./Map";

type LayerProps = {
	options: mapboxgl.AnyLayer;
	beforeId?: string;
};
const Layer: React.FC<LayerProps> = ({ options, beforeId }) => {
	const map = useInnerMap();
	React.useEffect(() => {
		if (!map) return;
		map.addLayer(options, beforeId);
		return () => {
			map.removeLayer(options.id);
		};
	}, [map, options, beforeId]);

	return null;
};

export default Layer;
