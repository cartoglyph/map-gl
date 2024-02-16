import React from "react";
import mapboxgl from "mapbox-gl";
import { useAtom } from "jotai";
import store from "@/store";

export type MapProps = {
	/** Unique ID for the map */
	id: string;
	/** Mapbox Access Token */
	accessToken: string;
	/** CSS style for the map container */
	style?: React.CSSProperties;
};
const Map: React.FC<MapProps> = ({ id, accessToken, style }) => {
	const containerRef = React.useRef<HTMLDivElement>(null);
	const loadedRef = React.useRef<boolean>(false);
	const [_map, setMap] = useAtom(store.map.mapAtom);

	// Mount the map into the container
	React.useEffect(() => {
		// Check if mapbox has already loaded into the container
		if (loadedRef.current || !containerRef.current) return;
		loadedRef.current = true;

		// Setup mapbox access token and create map
		mapboxgl.accessToken = accessToken;
		const newMap = new mapboxgl.Map({
			container: id, // container ID
			style: "mapbox://styles/mapbox/streets-v12", // style URL
			center: [-74.5, 40], // starting position [lng, lat]
			zoom: 9, // starting zoom
		});
		setMap(newMap);

		// Setup resize observer to resize the map when the dom changes
		const resizeObserver = new ResizeObserver(() => {
			if (newMap.loaded()) {
				newMap.resize();
			}
		});
		resizeObserver.observe(containerRef.current);
	}, []);

	return <div id={id} ref={containerRef} style={style} />;
};

export default Map;
