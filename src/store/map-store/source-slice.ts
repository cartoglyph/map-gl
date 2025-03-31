import { StateCreator } from "zustand";
import { addSource, removeSource, updateSource } from "@/utils/source-utils";
import { MapSlice } from "./map-slice";
import { SourceSpecification, SourcesSpecification } from "@/types";

export type SourceSlice = {
  /** A map of sources by id */
  sources: SourcesSpecification;
  /** Add a source to the map */
  addSource: (sourceId: string, sourceSpec: SourceSpecification) => void;
  /** Remove a source from the map */
  removeSource: (sourceId: string) => void;
  /** Update a source on the map */
  updateSource: (
    sourceId: string,
    sourceSpec: SourceSpecification,
    prevSourceId: string,
    prevSourceSpec: SourceSpecification
  ) => void;
};

const createSourceSlice: StateCreator<
  SourceSlice & MapSlice,
  [],
  [],
  SourceSlice
> = (set) => ({
  sources: {},
  addSource: (sourceId, source) => {
    set(({ map, sources }) => {
      sources[sourceId] = source;

      if (map) {
        addSource(map, sourceId, source);
      }

      return { sources };
    });
  },
  removeSource: (sourceId) => {
    set(({ map, sources }) => {
      delete sources[sourceId];

      if (map) {
        removeSource(map, sourceId);
      }

      return { sources };
    });
  },
  updateSource: (sourceId, sourceSpec, prevSourceId, prevSourceSpec) => {
    set(({ map, sources }) => {
      sources[sourceId] = sourceSpec;

      // If source id did not change, update source
      if (sourceId === prevSourceId) {
        if (map) {
          updateSource(map, sourceId, sourceSpec, prevSourceSpec);
        }
        return { sources };
      }

      // If source id changed, remove source and add new source with id
      console.warn(
        `Source ID has changed (previous: '${prevSourceId}', current: '${sourceId}') this can affect performance.`
      );
      delete sources[prevSourceId];
      if (map) {
        removeSource(map, prevSourceId);
        addSource(map, sourceId, sourceSpec);
      }
      return { sources };
    });
  },
});

export default createSourceSlice;
