"use client";
import { Route, RouteEnum, RouteSchema } from "@/types";
import { MapProvider } from "@dimapio/map-gl";
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
};

function useExample() {
  const pathname = usePathname();
  const routeResult = RouteSchema.safeParse(pathname);
  if (routeResult.success) {
    return EXAMPLES[routeResult.data];
  }
  return null;
}

export default function ExamplePage() {
  const Component = useExample();
  return (
    <main className="h-full w-full">
      <MapProvider>
        {Component ? <Component /> : <div>Example does not exist!</div>}
      </MapProvider>
    </main>
  );
}

export function generateStaticParams() {
  return Object.values(Route).map((route) => {
    return { example: route };
  });
}
