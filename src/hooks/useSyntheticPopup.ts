import { useRef, useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import mapboxgl from "mapbox-gl";
import { useMap } from "@/hooks";
import type { PopupEvent } from "@/types";

export type SyntheticPopupInput = {
  key: string; // unique id per popup
  lngLat: mapboxgl.LngLatLike; // where to anchor
  features: mapboxgl.GeoJSONFeature[]; // what you get back in <Portals>
};

export default function useSyntheticPopup(
  opts?: Partial<mapboxgl.PopupOptions>
) {
  const map = useMap();
  const containersRef = useRef<Record<string, HTMLDivElement>>({});
  const popupsRef = useRef<Record<string, mapboxgl.Popup>>({});
  const [events, setEvents] = useState<Record<string, PopupEvent>>({});

  useEffect(() => {
    return () => {
      Object.values(popupsRef.current).forEach((p) => p.remove());
      Object.values(containersRef.current).forEach((c) => c.remove());
    };
  }, []);

  const _createPopup = useCallback(
    ({ key, lngLat, features }: SyntheticPopupInput) => {
      if (!map) return;

      /* close & delete previous popup with same key (if any) */
      if (popupsRef.current[key]) {
        popupsRef.current[key].remove();
        containersRef.current[key].remove();
      }

      const container = document.createElement("div");
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        ...opts,
      })
        .setDOMContent(container)
        .setLngLat(lngLat)
        .addTo(map);

      containersRef.current[key] = container;
      popupsRef.current[key] = popup;

      setEvents((prev) => ({
        ...prev,
        [key]: {
          features,
          lngLat: mapboxgl.LngLat.convert(lngLat),
          point: new mapboxgl.Point(0, 0),
        },
      }));
    },
    [map]
  );

  const open = _createPopup;

  const openAll = useCallback(
    (arr: SyntheticPopupInput[]) => arr.forEach(_createPopup),
    [_createPopup]
  );

  const close = useCallback((key: string) => {
    popupsRef.current[key]?.remove();
    containersRef.current[key]?.remove();

    delete popupsRef.current[key];
    delete containersRef.current[key];

    setEvents((prev) => {
      const { [key]: _removed, ...rest } = prev; // omit key
      return rest;
    });
  }, []);

  const closeAll = useCallback(() => {
    Object.keys(popupsRef.current).forEach(close);
  }, [close]);

  /* one React render = one JSX tree; Mapbox still needs one <div> per popup */
  const Portals = ({
    children,
  }: {
    children: (e: PopupEvent, key: string) => React.ReactNode;
  }) =>
    Object.entries(events).map(([key, ev]) =>
      containersRef.current[key]
        ? createPortal(children(ev, key), containersRef.current[key])
        : null
    );

  return { open, openAll, close, closeAll, Portals };
}
