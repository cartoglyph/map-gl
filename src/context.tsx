import React from "react";
import { createStore, Provider } from "jotai";

/** Global map-gl store */
export const store = createStore();

/** Global map-gl provider */
export const MapProvider: React.FC<{ children?: React.ReactNode }> = ({
	children,
}) => <Provider store={store}>{children}</Provider>;
