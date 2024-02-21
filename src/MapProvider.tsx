import React from "react";
import { Provider } from "jotai";
import { globalStore } from "./store";

/** Global map-gl provider */
export const MapProvider: React.FC<{ children?: React.ReactNode }> = ({
	children,
}) => <Provider store={globalStore}>{children}</Provider>;
