import ExampleViewer from "@/components/ExampleViewer";
import { ExampleRoutes } from "@/types";

export default function ExamplePage() {
  return (
    <main className="h-full w-full">
      <ExampleViewer />
    </main>
  );
}

export function generateStaticParams() {
  console.log(Object.values(ExampleRoutes));
  return Object.values(ExampleRoutes).map((route) => ({
    example: route.replace("/example/", ""),
  }));
}
