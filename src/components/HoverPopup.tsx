import React from "react";
import { createPortal } from "react-dom";
import mapboxgl from "mapbox-gl";
import { useMapEvent } from "@/hooks";
import { PopupEvent } from "@/types";
import { useInnerMap } from "./Map";

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
	const [map] = useInnerMap();
	const popupRef = React.useRef<mapboxgl.Popup | null>(null);
	const containerRef = React.useRef<HTMLDivElement | null>(null);
	const [event, setEvent] = React.useState<PopupEvent | null>(null);

	React.useEffect(() => {
		if (!map) return;
		const container = document.createElement("div");
		containerRef.current = container;
		const popup = new mapboxgl.Popup({ ...DefaultPopupOptions, ...options });
		popup.setDOMContent(container);
		popupRef.current = popup;
		return () => {
			popup.remove();
		};
	}, [map]);
	useMapEvent({
		map,
		type: "mousemove",
		layerId,
		callback: (e) => {
			if (!containerRef.current) return;
			if (!map) return;
			map.getCanvas().style.cursor = "pointer";
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
	useMapEvent({
		map,
		type: "mouseleave",
		layerId,
		callback: () => {
			if (!map) return;
			map.getCanvas().style.cursor = "";
			setEvent(null);
			popupRef.current?.remove();
		},
	});
	if (!containerRef.current) return null;
	if (!event) return null;
	return createPortal(children(event), containerRef.current);
};

export default HoverPopup;
