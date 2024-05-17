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
  return Object.values(ExampleRoutes).map((route) => ({
    example: route.replace("/example/", ""),
  }));
}
