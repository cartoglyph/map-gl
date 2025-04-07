export type OrderedLayerSpecification = mapboxgl.LayerSpecification & {
  beforeId?: string;
};
export type OrderedLayersSpecification = Record<
  string,
  OrderedLayerSpecification
>;

export type MapLayerEvent = mapboxgl.MapTouchEvent | mapboxgl.MapMouseEvent;
export type MapEventCallback = (ev: MapLayerEvent) => void;

export type Popup = mapboxgl.Popup;
export type PopupOptions = mapboxgl.PopupOptions;
export type PopupEvent = {
  lngLat: mapboxgl.LngLat;
  point: mapboxgl.Point;
  features: mapboxgl.GeoJSONFeature[];
};
export type BBoxStyle = Omit<
  React.CSSProperties,
  "position" | "top" | "left" | "width" | "height"
>;
