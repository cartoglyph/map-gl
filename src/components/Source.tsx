import React from "react";
import mapboxgl from "mapbox-gl";
import { useMapStore } from "@/store/mapStore";

type SourceProps = {
  id: string;
  options: mapboxgl.AnySourceData;
};
const Source: React.FC<SourceProps> = (props) => {
  const { id, options } = props;
  const mapStore = useMapStore(
    ({ addSource, removeSource, updateSource, map }) => ({
      addSource,
      removeSource,
      updateSource,
      map,
    })
  );

  const prevPropsRef = React.useRef<SourceProps>(props);
  prevPropsRef.current = props;

  // Handle mount
  React.useEffect(() => {
    mapStore.addSource(id, options);

    // Handle unmount
    return () => {
      mapStore.removeSource(id);
    };
  }, []);

  // Handle update
  React.useEffect(() => {
    mapStore.updateSource(
      id,
      options,
      prevPropsRef.current.id,
      prevPropsRef.current.options
    );
  }, [id, options]);

  return null;
};

export default Source;
