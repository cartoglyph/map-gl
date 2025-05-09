import z from "zod";

/** All example routes */
export const ExampleRoutes = {
  Map: "/example/map",
  Source: "/example/source",
  Layer: "/example/layer",
  Popup: "/example/popup",
  Popup2: "/example/popup2",
  Popup3: "/example/popup3",
  LayerPopup: "/example/use-layer-popup",
  SyntheticPopup: "/example/use-synthetic-popup",
  BBoxTool: "/example/bbox-tool",
  DrawPolygonTool: "/example/draw-polygon-tool",
  Theme: "/example/theme",
} as const;

/** A schema for all example routes */
export const ExampleRouteSchema = z.nativeEnum(ExampleRoutes);

/** A valid route */
export type ExampleRoute = z.infer<typeof ExampleRouteSchema>;

/** A sidebar link */
export type LinkItem = {
  type: "link";
  label: string;
  route: ExampleRoute;
};

/** A sidebar heading */
export type HeadingItem = {
  type: "heading";
  heading: string;
};

/** Any sidebar section item */
export type SidebarItem = LinkItem | HeadingItem;

/** The items to render in the sidebar */
export const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    type: "heading",
    heading: "Components",
  },
  {
    type: "link",
    label: "Map",
    route: ExampleRoutes.Map,
  },
  {
    type: "link",
    label: "Source",
    route: ExampleRoutes.Source,
  },
  {
    type: "link",
    label: "Layer",
    route: ExampleRoutes.Layer,
  },
  {
    type: "link",
    label: "Popup",
    route: ExampleRoutes.Popup,
  },
  {
    type: "link",
    label: "Popup2",
    route: ExampleRoutes.Popup2,
  },
  {
    type: "link",
    label: "Popup3",
    route: ExampleRoutes.Popup3,
  },
  {
    type: "link",
    label: "BBoxTool",
    route: ExampleRoutes.BBoxTool,
  },
  {
    type: "link",
    label: "DrawPolygonTool",
    route: ExampleRoutes.DrawPolygonTool,
  },
  {
    type: "heading",
    heading: "Hooks",
  },
  {
    type: "link",
    label: "useLayerPopup",
    route: ExampleRoutes.LayerPopup,
  },
  {
    type: "link",
    label: "useSyntheticPopup",
    route: ExampleRoutes.SyntheticPopup,
  },
  {
    type: "heading",
    heading: "Style",
  },
  {
    type: "link",
    label: "theme",
    route: ExampleRoutes.Theme,
  },
];
