/**
 * FOR INTERNAL USE ONLY
 * USE WITH CAUTION
 */
import { createStore } from "jotai";
import * as maps from "./maps.store";
import * as theme from "./theme.store";

const store = {
  maps,
  theme,
};

/** Global map-gl store */
export const globalStore = createStore();

export default store;
