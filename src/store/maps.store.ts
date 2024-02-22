import mapboxgl from "mapbox-gl";
import { atom } from "jotai";

// TODO: keep tracking of loading state for each map reference (loading, loaded, error)
/** A record of all map references by id */
export type Maps = Record<string, mapboxgl.Map | null>;

/** An atom of map references */
export const mapsAtom = atom<Maps>({});
