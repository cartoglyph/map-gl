"use client";
import { Route, RouteEnum, RouteSchema } from "@/types";
import { MapProvider, MapTheme } from "@dimapio/map-gl";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const EXAMPLES: Record<RouteEnum, React.ComponentType> = {
  [Route.Map]: dynamic(() => import("@/components/examples/MapExample")),
  [Route.Source]: dynamic(() => import("@/components/examples/MapExample")),
  [Route.Layer]: dynamic(() => import("@/components/examples/LayerExample")),
  [Route.Popup]: dynamic(() => import("@/components/examples/PopupExample")),
  [Route.BBoxTool]: dynamic(
    () => import("@/components/examples/BBoxToolExample")
  ),
  [Route.DrawPolygonTool]: dynamic(
    () => import("@/components/examples/DrawPolygonToolExample")
  ),
  [Route.Theme]: dynamic(() => import("@/components/examples/ThemeExample")),
};

const THEMES: Partial<Record<RouteEnum, MapTheme>> = {
  [Route.Theme]: {
    BBoxTool: {
      bboxStyle: {
        border: "1px solid blue",
        backgroundColor: "red",
        opacity: 0.5,
      },
    },
  },
};

function useExample() {
  const pathname = usePathname();
  const routeResult = RouteSchema.safeParse(pathname);
  if (routeResult.success) {
    const Component = EXAMPLES[routeResult.data];
    const theme = THEMES[routeResult.data];
    return { Component, theme };
  }
  return {};
}

const ExampleViewer = () => {
  const { Component, theme } = useExample();
  return (
    <MapProvider theme={theme}>
      {Component ? <Component /> : <div>Example does not exist!</div>}
    </MapProvider>
  );
};

export default ExampleViewer;
