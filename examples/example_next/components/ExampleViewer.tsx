"use client";

import { ExampleRoute, ExampleRouteSchema, ExampleRoutes } from "@/types";
import { GlobalProvider, MapTheme } from "@cartoglyph/map-gl";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const EXAMPLES: Record<ExampleRoute, React.ComponentType> = {
  [ExampleRoutes.Map]: dynamic(
    () => import("@/components/examples/MapExample")
  ),
  [ExampleRoutes.Source]: dynamic(
    () => import("@/components/examples/MapExample")
  ),
  [ExampleRoutes.Layer]: dynamic(
    () => import("@/components/examples/LayerExample")
  ),
  [ExampleRoutes.Popup]: dynamic(
    () => import("@/components/examples/PopupExample")
  ),
  [ExampleRoutes.Popup2]: dynamic(
    () => import("@/components/examples/LayerPopupExample2")
  ),
  [ExampleRoutes.Popup3]: dynamic(
    () => import("@/components/examples/SyntheticPopupExample2")
  ),
  [ExampleRoutes.LayerPopup]: dynamic(
    () => import("@/components/examples/LayerPopupExample")
  ),
  [ExampleRoutes.SyntheticPopup]: dynamic(
    () => import("@/components/examples/SyntheticPopupExample")
  ),
  [ExampleRoutes.BBoxTool]: dynamic(
    () => import("@/components/examples/BBoxToolExample")
  ),
  [ExampleRoutes.DrawPolygonTool]: dynamic(
    () => import("@/components/examples/DrawPolygonToolExample")
  ),
  [ExampleRoutes.EditPolygonTool]: dynamic(
    () => import("@/components/examples/EditPolygonToolExample")
  ),
  [ExampleRoutes.Theme]: dynamic(
    () => import("@/components/examples/ThemeExample")
  ),
};

const THEMES: Partial<Record<ExampleRoute, MapTheme>> = {
  [ExampleRoutes.Theme]: {
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
  const routeResult = ExampleRouteSchema.safeParse(pathname);
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
    <GlobalProvider theme={theme}>
      {Component ? <Component /> : <div>Example does not exist!</div>}
    </GlobalProvider>
  );
};

export default ExampleViewer;
