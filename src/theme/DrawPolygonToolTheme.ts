export type DrawPolygonToolTheme = {
  fillPaint?: mapboxgl.FillLayerSpecification["paint"];
  lineLayout?: mapboxgl.LineLayerSpecification["layout"];
  linePaint?: mapboxgl.LineLayerSpecification["paint"];
  circlePaint?: mapboxgl.CircleLayerSpecification["paint"];
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
