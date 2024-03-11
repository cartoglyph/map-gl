import mapboxgl from "mapbox-gl";

export type MapLayerEvent = (
  | mapboxgl.MapLayerTouchEvent
  | mapboxgl.MapLayerMouseEvent
) &
  mapboxgl.EventData;
export type MapEventCallback = (ev: MapLayerEvent) => void;
export type MapLayerEventType = keyof mapboxgl.MapLayerEventType;
export type PopupEvent = {
  lngLat: mapboxgl.LngLat;
  point: mapboxgl.Point;
  features: mapboxgl.MapboxGeoJSONFeature[];
};
export type LayerOptions = mapboxgl.AnyLayer & {
  beforeId?: string;
};
export type BBoxStyle = Omit<
  React.CSSProperties,
  "position" | "top" | "left" | "width" | "height"
>;
