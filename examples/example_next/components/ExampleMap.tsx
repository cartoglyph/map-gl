"use client";
import React from "react";
import { Map } from "@dimapio/map-gl";

const ExampleMap = () => {
	return (
		<Map
			id="main"
			accessToken={String(process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN)}
			style={{ width: "500px", height: "500px" }}
		/>
	);
};

export default ExampleMap;
