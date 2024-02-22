import React from "react";
import mapboxgl from "mapbox-gl";
import { Provider, useAtom } from "jotai";
import atoms, { globalStore } from "@/store";
import {
	innerMapStore,
	useInnerLayers,
	useInnerMap,
	useInnerSources,
} from "./Map.store";
import "mapbox-gl/dist/mapbox-gl.css";

export type MapProps = {
	/** Unique ID for the map */
	id: string;
	/** Mapbox Access Token */
	accessToken: string;
	/** CSS style for the map container */
	style?: React.CSSProperties;
	/** Children map layers */
	children?: React.ReactNode;
	/** Mapbox options */
	options?: Omit<mapboxgl.MapboxOptions, "container">;
};

const DefaultMapOptions: Partial<mapboxgl.MapboxOptions> = {
	style: "mapbox://styles/mapbox/streets-v12",
	center: [-74.5, 40],
	zoom: 9,
};

const InnerMap: React.FC<MapProps> = ({
	id,
	accessToken,
	style,
	children,
	options,
}) => {
	const containerRef = React.useRef<HTMLDivElement>(null);
	const loadedRef = React.useRef<boolean>(false);
	const [_maps, setMaps] = useAtom(atoms.maps.mapsAtom, { store: globalStore });
	const [_innerMap, setInnerMap] = useInnerMap();
	const [_innerSources, setInnerSources] = useInnerSources();
	const [_innerLayers, setInnerLayers] = useInnerLayers();

	// Mount the map into the container
	React.useEffect(() => {
		// Check if mapbox has already loaded into the container
		if (loadedRef.current) return;
		// Check if we have the map container reference
		if (!containerRef.current) return;
		loadedRef.current = true;

		// Setup mapbox access token and create map
		mapboxgl.accessToken = accessToken;

		const map = new mapboxgl.Map({
			container: id, // container ID
			...{ ...DefaultMapOptions, ...options },
		});
		let resizeObserver: ResizeObserver | null = null;
		map.on("load", (e) => {
			const mapRef = e.target;
			const sources = mapRef.getStyle().sources;
			const layers = mapRef.getStyle().layers;
			const currentLayers = layers.reduce(
				(acc, curr) => ({ ...acc, [curr.id]: curr }),
				{}
			);

			// Add map to global context & inner context
			setMaps((prev) => ({ ...prev, [id]: mapRef }));
			setInnerSources((prev) => ({ ...prev, ...sources }));
			setInnerLayers((prev) => ({ ...prev, ...currentLayers }));
			setInnerMap(mapRef);

			// Setup resize observer to resize the map when the dom changes
			if (!containerRef.current) {
				console.warn("Missing container after map has loaded");
			} else {
				resizeObserver = new ResizeObserver(() => {
					if (mapRef.loaded()) {
						mapRef.resize();
					}
				});
				resizeObserver.observe(containerRef.current);
			}
		});

		// Cleanup map reference and resize observer
		return () => {
			setMaps((prev) => {
				delete prev[id];
				return prev;
			});
			setInnerMap(null);
			resizeObserver?.disconnect();
		};
	}, [id, options]);

	return (
		<div id={id} ref={containerRef} style={style}>
			{children}
		</div>
	);
};

/** A dimapio map-gl map */
const Map: React.FC<MapProps> = (props) => {
	return (
		<Provider store={innerMapStore}>
			<InnerMap {...props} />
		</Provider>
	);
};

export default Map;
