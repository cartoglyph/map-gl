import React from "react";
import mapboxgl from "mapbox-gl";
import { useInnerMap, useInnerSources } from "./Map";
import { updateSource } from "@/utils/sourceUtils";

type SourceProps = {
	id: string;
	options: mapboxgl.AnySourceData;
};
const Source: React.FC<SourceProps> = ({ id, options }) => {
	const [map] = useInnerMap();
	const [_sources, setSources] = useInnerSources();
	const prevPropsRef = React.useRef<mapboxgl.AnySourceData>(options);
	prevPropsRef.current = options;

	// Handle mount
	React.useEffect(() => {
		if (!map) return;
		setSources((prev) => ({ ...prev, [id]: options }));
	}, [map, id]);
	// Handle unmount
	React.useEffect(() => {
		return () => {
			setSources((prev) => {
				delete prev[id];
				return prev;
			});
		};
	}, []);
	// Handle update
	React.useEffect(() => {
		if (!map) return;
		updateSource(map, id, options, prevPropsRef.current);
	}, [map, id, options]);

	return null;
};

export default Source;
