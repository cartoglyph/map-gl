import React from "react";
import { createPortal } from "react-dom";
import { useLayerEvent, useMap } from "@/hooks";
import { PopupEvent } from "@/types";
import { Popup, PopupOptions } from "mapbox-gl";

const DefaultPopupOptions: Partial<PopupOptions> = {
  closeButton: false,
};
type HoverPopupProps = {
  layerId: string;
  options?: Partial<PopupOptions>;
  children: (e: PopupEvent) => React.ReactNode;
};
const HoverPopup: React.FC<HoverPopupProps> = ({
  layerId,
  options,
  children,
}) => {
  const map = useMap();
  const popupRef = React.useRef<Popup | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [event, setEvent] = React.useState<PopupEvent | null>(null);

  React.useEffect(() => {
    if (!map) return;
    const container = document.createElement("div");
    containerRef.current = container;
    const popup = new Popup({ ...DefaultPopupOptions, ...options });
    popup.setDOMContent(container);
    popupRef.current = popup;
    return () => {
      popup.remove();
      containerRef.current?.remove();
      containerRef.current = null;
    };
  }, [map]);
  useLayerEvent({
    map,
    type: "mousemove",
    layerId,
    callback: (e) => {
      if (!containerRef.current) return;
      if (!map) return;
      const features = e.features || [];
      if (!features.length) return;
      popupRef.current?.setLngLat(e.lngLat);
      setEvent((prev) => {
        if (!prev) {
          popupRef.current?.addTo(map);
        }
        return { features, lngLat: e.lngLat, point: e.point };
      });
    },
  });
  useLayerEvent({
    map,
    type: "mouseleave",
    layerId,
    callback: () => {
      if (!map) return;
      setEvent(null);
      popupRef.current?.remove();
    },
  });
  if (!containerRef.current) return null;
  if (!event) return null;
  return createPortal(children(event), containerRef.current);
};

export default HoverPopup;
