import { atom } from "jotai";
import { DefaultTheme, MapTheme } from "@/theme";

/** An atom of the map theme */
export const themeAtom = atom<MapTheme>(DefaultTheme);
