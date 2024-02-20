import { atom, createStore, useAtomValue } from "jotai";

/** Inner map reference for use with children layers */
export const innerMapAtom = atom<mapboxgl.Map | null>(null);

/** Inner map reference store */
export const innerMapStore = createStore();

/** Utility to access the map reference inside the map */
export const useInnerMap = () =>
	useAtomValue(innerMapAtom, { store: innerMapStore });
