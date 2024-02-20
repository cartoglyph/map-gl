"use client";
import ExampleMap from "@/components/ExampleMap";
import { MapProvider } from "@dimapio/map-gl";

export default function Home() {
	return (
		<main className="flex flex-col w-full items-center">
			<h1>@dimapio/map-gl</h1>
			<MapProvider>
				<ExampleMap />
			</MapProvider>
		</main>
	);
}
