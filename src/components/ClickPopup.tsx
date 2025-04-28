import React from "react";
import mapboxgl from "mapbox-gl";
import { useLayerEvent, useMap } from "@/hooks";
import { PopupEvent } from "@/types";
import Popup from "./Popup";

type ClickPopupProps = {
  layerId: string;
  locked?: boolean;
  options?: Partial<mapboxgl.PopupOptions>;
  children: (e: PopupEvent) => React.ReactNode;
};
const ClickPopup: React.FC<ClickPopupProps> = ({
  layerId,
  locked = false,
  options,
  children,
}) => {
  const map = useMap();
  const [event, setEvent] = React.useState<PopupEvent | null>(null);
  const [lngLat, setLngLat] = React.useState<mapboxgl.LngLat | null>(null);

  useLayerEvent({
    map,
    type: "click",
    layerId,
    callback: (e) => {
      if (locked) return; // 🔒 Prevent creating new popups when locked
      if (!map) return;
      const features = e.features || [];
      if (!features.length) return;
      setLngLat(e.lngLat);
      setEvent({ features, lngLat: e.lngLat, point: e.point });
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

export default ClickPopup;
