import React from "react";
import mapboxgl from "mapbox-gl";
import MapProvider from "@/providers/MapProvider";
import { useMapStore } from "@/store/mapStore";
import "mapbox-gl/dist/mapbox-gl.css";
import { useGlobalStore } from "@/store/globalStore";

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
  options?: Omit<mapboxgl.MapOptions, "container">;
};

const DefaultMapOptions: Partial<mapboxgl.MapOptions> = {
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
  const resizeObserverRef = React.useRef<ResizeObserver>();
  const globalStore = useGlobalStore((store) => store);
  const mapStore = useMapStore((store) => store);

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
      container: id,
      ...{ ...DefaultMapOptions, ...options },
    });

    // Handle map load event
    map.on("load", () => {
      // Check if we have the map container reference
      if (!containerRef.current) return;

      // If global store exists, add map
      if (globalStore) {
        globalStore.addMap(id, map);
      }

      // Initialize map store
      mapStore.init(map);

      // Setup resize observer to resize the map when the dom changes
      resizeObserverRef.current = createMapResizeObserver(
        map,
        containerRef.current
      );
    });
  }, [id, options]);

  // Handle unmount
  React.useEffect(() => {
    return () => {
      // Cleanup global map reference
      if (globalStore) {
        globalStore.removeMap(id);
      }

      // Cleanup map reference
      mapStore.unload();

      // Disconnect resize observer
      resizeObserverRef.current?.disconnect();
    };
  }, []);

  return (
    <div id={id} ref={containerRef} style={style}>
      {children}
    </div>
  );
};

/** A dimapio map-gl map */
const Map: React.FC<MapProps> = (props) => {
  return (
    <MapProvider>
      <InnerMap {...props} />
    </MapProvider>
  );
};

export default Map;

// TODO: we might be able to use `map.getContainer` instead of passing the container
/** Create a resize observer to resize the map */
function createMapResizeObserver(
  map: mapboxgl.Map,
  container: HTMLDivElement
): ResizeObserver {
  let timer: NodeJS.Timeout;
  const resizeObserver = new ResizeObserver(() => {
    // debounce map resize
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      try {
        map.resize();
      } catch (err) {
        /** ignore error */
      }
    }, 100);
  });
  resizeObserver.observe(container);
  return resizeObserver;
}
