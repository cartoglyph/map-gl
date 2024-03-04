/**
 * FOR INTERNAL USE ONLY
 * USE WITH CAUTION
 */
import { createStore } from "jotai";
import * as maps from "./maps.store";

const store = {
  maps,
};

/** Global map-gl store */
export const globalStore = createStore();

export default store;
