import React from "react";
import { useLayerEvent, useMap } from "@/hooks";
import { PopupEvent } from "@/types";
import mapboxgl from "mapbox-gl";
import Popup from "./Popup";

const DefaultPopupOptions: Partial<mapboxgl.PopupOptions> = {
  closeButton: false,
};
type HoverPopupProps = {
  layerId: string;
  options?: Partial<mapboxgl.PopupOptions>;
  children: (e: PopupEvent) => React.ReactNode;
};
const HoverPopup: React.FC<HoverPopupProps> = ({
  layerId,
  options,
  children,
}) => {
  const map = useMap();
  const [event, setEvent] = React.useState<PopupEvent | null>(null);
  const [lngLat, setLngLat] = React.useState<mapboxgl.LngLat | null>(null);

  useLayerEvent({
    map,
    type: "mousemove",
    layerId,
    callback: (e) => {
      if (!map) return;
      const features = e.features || [];
      if (!features.length) return;
      setLngLat(e.lngLat);
      setEvent({ features, lngLat: e.lngLat, point: e.point });
    },
  });
  useLayerEvent({
    map,
    type: "mouseleave",
    layerId,
    callback: () => {
      if (!map) return;
      setEvent(null);
    },
  });
  if (!event) return null;
  if (!lngLat) return null;
  return (
    <Popup lngLat={lngLat} options={options}>
      {children(event)}
    </Popup>
  );
};

export default HoverPopup;
