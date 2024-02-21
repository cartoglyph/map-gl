import React from "react";
import mapboxgl from "mapbox-gl";
import { MapEventCallback, MapLayerEventType } from "@/types";

type UseMapEventParams = {
	map: mapboxgl.Map | null;
	type: MapLayerEventType;
	layerId: string;
	callback: MapEventCallback;
};
const useMapEvent = ({ map, type, layerId, callback }: UseMapEventParams) => {
	const callbackRef = React.useRef(callback);
	callbackRef.current = callback;

	React.useEffect(() => {
		if (!map) return;
		const listener: MapEventCallback = (e) => callbackRef.current(e);
		map.on(type, layerId, listener);
		return () => {
			map.off(type, listener);
		};
	}, [map, type, layerId]);
};

export default useMapEvent;
