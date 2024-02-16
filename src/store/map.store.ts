import { atom } from "jotai";
import mapboxgl from "mapbox-gl";

/** A reference to the mapbox map */
export const mapAtom = atom<mapboxgl.Map | null>(null);
