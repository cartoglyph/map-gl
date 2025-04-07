import React from "react";
import { useMapStore } from "@/hooks/useMapStore";

type SourceProps = {
  id: string;
  options: mapboxgl.SourceSpecification;
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
    prevPropsRef.current = props;
  }, [id, options]);

  return null;
};

export default Source;
