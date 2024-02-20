import React from "react";
import { useInnerMap } from "./Map";

type SourceProps = {
	id: string;
	options: mapboxgl.AnySourceData;
};
const Source: React.FC<SourceProps> = ({ id, options }) => {
	const map = useInnerMap();
	React.useEffect(() => {
		if (!map) return;
		map.addSource(id, options);
		return () => {
			map.removeSource(id);
		};
	}, [map, id, options]);

	return null;
};

export default Source;
