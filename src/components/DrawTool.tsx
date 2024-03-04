import React from "react";
import mapboxgl from "mapbox-gl";
import { useMapEvent } from "@/hooks";
import { useInnerMap } from "./Map";

// TODO: hold drawing as LineString source, push points onto the LineString as they are clicked
// https://docs.mapbox.com/mapbox-gl-js/example/geojson-line/
type DrawToolProps = {
  disabled?: boolean;
};
const DrawTool: React.FC<DrawToolProps> = ({ disabled }) => {
  const [map] = useInnerMap();
  const drawingRef = React.useRef<mapboxgl.LngLat[]>([]);

  React.useEffect(() => {
    if (!map) return;
    if (disabled) return;
    map.dragPan.disable();
    map.dragRotate.disable();
    map.boxZoom.disable();
    map.scrollZoom.disable();
    map.touchPitch.disable();
    map.touchZoomRotate.disable();
    map.doubleClickZoom.disable();
    return () => {
      map.dragPan.enable();
      map.dragRotate.enable();
      map.boxZoom.enable();
      map.scrollZoom.enable();
      map.touchPitch.enable();
      map.touchZoomRotate.enable();
      map.doubleClickZoom.enable();
    };
  }, [map, disabled]);

  useMapEvent({
    map,
    type: "click",
    callback: (e) => {
      drawingRef.current.push(e.lngLat);
      console.log("click", e.lngLat);
    },
  });

  return null;
};

export default DrawTool;
