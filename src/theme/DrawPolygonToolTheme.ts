import {
  CircleLayerSpecification,
  FillLayerSpecification,
  LineLayerSpecification,
} from "mapbox-gl";

export type DrawPolygonToolTheme = {
  fillPaint?: FillLayerSpecification["paint"];
  lineLayout?: LineLayerSpecification["layout"];
  linePaint?: LineLayerSpecification["paint"];
  circlePaint?: CircleLayerSpecification["paint"];
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
