import React from "react";
import { MapEventCallback } from "@/types";
import { Map, MapEventType } from "mapbox-gl";

type UseMapLayerParams = {
  map: Map | null;
  type: MapEventType;
  layerId: string;
  disabled?: boolean;
  callback: MapEventCallback;
};
const useLayerEvent = ({
  map,
  type,
  layerId,
  disabled = false,
  callback,
}: UseMapLayerParams) => {
  const callbackRef = React.useRef(callback);
  callbackRef.current = callback;

  React.useEffect(() => {
    if (!map) return;
    if (disabled) return;
    const listener: MapEventCallback = (e) => callbackRef.current(e);
    map.on(type, layerId, listener);
    return () => {
      map.off(type, listener);
    };
  }, [map, type, layerId, disabled]);
};

export default useLayerEvent;
