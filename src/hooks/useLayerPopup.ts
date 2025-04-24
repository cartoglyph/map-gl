import { useRef, useCallback, useState, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import mapboxgl from "mapbox-gl";
import { useMap } from "@/hooks";
import type { MapLayerEvent, PopupEvent, PopupOptions } from "@/types";

export default function useLayerPopup(opts: Partial<PopupOptions> = {}) {
  const map = useMap();
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const container = useRef<HTMLDivElement | null>(null);
  const lastSigRef = useRef<string>(""); // ← feature sig cache
  const [event, setEvent] = useState<PopupEvent | null>(null);

  /* ---------- create the Mapbox popup once ---------- */
  useLayoutEffect(() => {
    if (!map) return;

    const popup = new mapboxgl.Popup({
      closeButton: false,
      ...opts,
    });

    popupRef.current = popup;

    return () => {
      popup.remove();
    };
  }, [map]);

  const ensureContainer = () => {
    if (!container.current) container.current = document.createElement("div");
    return container.current;
  };

  const sig = (f: MapLayerEvent) =>
    `${f.lngLat.lng}-${f.lngLat.lat}-${f.features?.map((x) => x.id).join(",")}`;

  /* ---------- open ---------- */
  const open = useCallback(
    (e: MapLayerEvent) => {
      if (!map || !e.features?.length) return;

      const newSig = sig(e);
      if (newSig === lastSigRef.current) {
        // nothing changed – just reposition if the lng/lat moved
        popupRef.current?.setLngLat(e.lngLat);
        return;
      }
      lastSigRef.current = newSig;

      // 1. mount / reuse popup
      const popup = popupRef.current!;
      popup.setDOMContent(ensureContainer());
      popup.setLngLat(e.lngLat).addTo(map);

      // 2. store event for portal
      setEvent({
        features: e.features,
        lngLat: e.lngLat,
        point: e.point,
      });
    },
    [map]
  );

  /* ---------- close ---------- */
  const close = useCallback(() => {
    popupRef.current?.remove();
    setEvent(null);
    lastSigRef.current = "";
  }, []);

  /* ---------- portal ---------- */
  const Portal = ({
    children,
  }: {
    children: (e: PopupEvent) => React.ReactNode;
  }) =>
    event && container.current
      ? createPortal(children(event), container.current)
      : null;

  return { open, close, Portal };
}
