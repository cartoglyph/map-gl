import { BBoxToolTheme, DefaultBBoxToolTheme } from "./BBoxToolTheme";
import {
  DefaultDrawPolygonToolTheme,
  DrawPolygonToolTheme,
} from "./DrawPolygonToolTheme";

export type MapTheme = {
  DrawPolygonTool?: DrawPolygonToolTheme;
  BBoxTool?: BBoxToolTheme;
};

export type ThemeComponentType = keyof MapTheme;

export const DefaultTheme: MapTheme = {
  DrawPolygonTool: DefaultDrawPolygonToolTheme,
  BBoxTool: DefaultBBoxToolTheme,
};
