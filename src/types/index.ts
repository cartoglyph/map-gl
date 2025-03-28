export type Map = mapboxgl.Map;
export type MapOptions = mapboxgl.MapOptions;
export type MapEventType = mapboxgl.MapEventType;

export type Source = mapboxgl.Source;
export type SourceSpecification = mapboxgl.SourceSpecification;
export type SourcesSpecification = mapboxgl.SourcesSpecification;

export type LayerSpecification = mapboxgl.LayerSpecification;
export type FillLayerSpecification = mapboxgl.FillLayerSpecification;
export type LineLayerSpecification = mapboxgl.LineLayerSpecification;
export type CircleLayerSpecification = mapboxgl.CircleLayerSpecification;
export type CustomLayerInterface = mapboxgl.CustomLayerInterface;

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

export type Point = mapboxgl.Point;
export type GeoJSONFeature = mapboxgl.GeoJSONFeature;
