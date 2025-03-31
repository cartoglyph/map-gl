import React from "react";
import { MapEventCallback, Map, MapEventType } from "@/types";

type UseMapEventParams = {
  map: Map | null;
  type: MapEventType;
  disabled?: boolean;
  callback: MapEventCallback;
};
const useMapEvent = ({
  map,
  type,
  disabled = false,
  callback,
}: UseMapEventParams) => {
  const callbackRef = React.useRef(callback);
  callbackRef.current = callback;

  React.useEffect(() => {
    if (!map) return;
    if (disabled) return;
    const listener: MapEventCallback = (e) => callbackRef.current(e);
    map.on(type, listener);
    return () => {
      map.off(type, listener);
    };
  }, [map, type, disabled]);
};

export default useMapEvent;
