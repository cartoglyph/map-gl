import z from "zod";

/** All valid routes */
export const Route = {
  Map: "/example/map",
  Source: "/example/source",
  Layer: "/example/layer",
  Popup: "/example/popup",
  BBoxTool: "/example/bbox-tool",
  DrawPolygonTool: "/example/draw-polygon-tool",
} as const;

/** A schema for all valid routes */
export const RouteSchema = z.nativeEnum(Route);

/** A valid route */
export type RouteEnum = (typeof Route)[keyof typeof Route];

/** A sidebar link */
export type LinkItem = {
  type: "link";
  label: string;
  route: RouteEnum;
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
    route: Route.Map,
  },
  {
    type: "link",
    label: "Source",
    route: Route.Source,
  },
  {
    type: "link",
    label: "Layer",
    route: Route.Layer,
  },
  {
    type: "link",
    label: "Popup",
    route: Route.Popup,
  },
  {
    type: "link",
    label: "BBoxTool",
    route: Route.BBoxTool,
  },
  {
    type: "link",
    label: "DrawPolygonTool",
    route: Route.DrawPolygonTool,
  },
];
