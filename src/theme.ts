import { BBoxStyle } from "@/types";

export type BBoxToolTheme = {
  bboxStyle?: BBoxStyle;
};

export type DrawPolygonToolTheme = {
  fillPaint?: mapboxgl.FillPaint;
  lineLayout?: mapboxgl.LineLayout;
  linePaint?: mapboxgl.LinePaint;
  circlePaint?: mapboxgl.CirclePaint;
};

export type MapTheme = {
  DrawPolygonTool?: DrawPolygonToolTheme;
  BBoxTool?: BBoxToolTheme;
};

export type ThemeComponentType = keyof MapTheme;

export const DefaultTheme: MapTheme = {
  DrawPolygonTool: {
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
  },
  BBoxTool: {
    bboxStyle: {
      border: "1px solid blue",
      backgroundColor: "blue",
      opacity: 0.5,
    },
  },
};
