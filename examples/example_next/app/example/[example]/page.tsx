import ExampleViewer from "@/components/ExampleViewer";
import { Route } from "@/types";

export default function ExamplePage() {
  return (
    <main className="h-full w-full">
      <ExampleViewer />
    </main>
  );
}

export function generateStaticParams() {
  return Object.values(Route)
    .filter((route) => route.startsWith("/example"))
    .map((route) => {
      const example = route.replace("/example", "").replace("/", "");
      return { example };
    });
}
