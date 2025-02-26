import React from "react";
import { Map, Point } from "mapbox-gl";
import { useComponentTheme, useMap, useMapEvent } from "@/hooks";
import { BBoxStyle, MapLayerEvent } from "@/types";

function getPoint(map: Map, e: MapLayerEvent): Point {
  const canvas = map.getCanvasContainer();
  const rect = canvas.getBoundingClientRect();
  const clientX = "clientX" in e.originalEvent ? e.originalEvent.clientX : 0;
  const clientY = "clientY" in e.originalEvent ? e.originalEvent.clientY : 0;
  const point = new Point(
    clientX - rect.left - canvas.clientLeft,
    clientY - rect.top - canvas.clientTop
  );
  return point;
}

type BBoxToolProps = {
  disabled?: boolean;
  bboxStyle?: BBoxStyle;
  onBBox: (bbox: [Point, Point]) => void;
};
const BBoxTool: React.FC<BBoxToolProps> = ({ disabled, bboxStyle, onBBox }) => {
  const map = useMap();

  // Handle component theme
  const theme = useComponentTheme("BBoxTool", { bboxStyle });
  const themeRef = React.useRef(theme);
  themeRef.current = theme;

  const pointsRef = React.useRef<Point[]>([]);
  const bboxRef = React.useRef<HTMLDivElement | undefined>(undefined);
  const [isMouseDown, setIsMouseDown] = React.useState<boolean>(false);

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
    type: "mousedown",
    disabled,
    callback: (e) => {
      if (!map) return;
      const point = getPoint(map, e);
      pointsRef.current = [point];
      setIsMouseDown(true);
    },
  });
  useMapEvent({
    map,
    type: "mousemove",
    disabled: !isMouseDown,
    callback: (e) => {
      if (!map) return;
      if (!pointsRef.current.length) return;
      if (!bboxRef.current) {
        const bbox = document.createElement("div");
        bbox.style.position = "absolute";
        bbox.style.top = "0";
        bbox.style.left = "0";
        bbox.style.width = "0";
        bbox.style.height = "0";

        // Apply custom style
        Object.entries(themeRef.current?.bboxStyle || {}).forEach(
          ([property, value]) => {
            bbox.style[property] = String(value);
          }
        );

        const canvas = map.getCanvasContainer();
        canvas.appendChild(bbox);
        bboxRef.current = bbox;
      }
      const [start] = pointsRef.current;
      const point = getPoint(map, e);

      const minX = Math.min(start.x, point.x),
        maxX = Math.max(start.x, point.x),
        minY = Math.min(start.y, point.y),
        maxY = Math.max(start.y, point.y);

      // Adjust width and xy position of the box element ongoing
      const pos = `translate(${minX}px, ${minY}px)`;
      bboxRef.current.style.transform = pos;
      bboxRef.current.style.width = maxX - minX + "px";
      bboxRef.current.style.height = maxY - minY + "px";
    },
  });
  useMapEvent({
    map,
    disabled,
    type: "mouseup",
    callback: (e) => {
      if (!map) return;
      if (pointsRef.current.length !== 1) return;
      const point = getPoint(map, e);
      pointsRef.current.push(point);
      const [bboxStart, bboxEnd] = pointsRef.current;
      onBBox([bboxStart, bboxEnd]);
      setIsMouseDown(false);
      bboxRef.current?.remove();
      bboxRef.current = undefined;
    },
  });
  return null;
};

export default BBoxTool;
