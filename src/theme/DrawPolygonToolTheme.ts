import mapboxgl from "mapbox-gl";

export type DrawPolygonToolTheme = {
  fillPaint?: mapboxgl.FillPaint;
  lineLayout?: mapboxgl.LineLayout;
  linePaint?: mapboxgl.LinePaint;
  circlePaint?: mapboxgl.CirclePaint;
};

export const DefaultDrawPolygonToolTheme: DrawPolygonToolTheme = {
  fillPaint: {
    "fill-color": "blue",
    "fill-opacity": 0.2,
  },
  lineLayout: {
    "line-cap": "round",
    "line-join": "round",
  },
  linePaint: {
    "line-color": "blue",
    "line-dasharray": [1, 2],
    "line-width": 2,
  },
  circlePaint: {
    "circle-color": "blue",
    "circle-radius": 5,
  },
};
