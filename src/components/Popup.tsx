import React from "react";
import { createPortal } from "react-dom";
import mapboxgl from "mapbox-gl";
import { useMap } from "@/hooks";

const DefaultPopupOptions: Partial<mapboxgl.PopupOptions> = {
  closeButton: false,
  closeOnClick: false,
};
type PopupProps = {
  lngLat: mapboxgl.LngLat;
  options?: Partial<mapboxgl.PopupOptions>;
  children: React.ReactNode;
};
const Popup: React.FC<PopupProps> = ({ lngLat, options, children }) => {
  const map = useMap();
  const [popup, setPopup] = React.useState<mapboxgl.Popup | null>(null);
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!map) return;

    const container = document.createElement("div");
    setContainer(container);
    const popup = new mapboxgl.Popup({ ...DefaultPopupOptions, ...options });
    popup.setDOMContent(container);
    popup.setLngLat(lngLat);
    popup.addTo(map);
    setPopup(popup);

    return () => {
      popup.remove();
      setPopup(null);
      container.remove();
      setContainer(null);
    };
  }, [map]);

  React.useEffect(() => {
    if (!popup) return;
    popup.setLngLat(lngLat);
  }, [lngLat]);

  if (!container || !popup) return null;
  return createPortal(children, container);
};

export default Popup;
