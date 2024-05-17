import { BBoxStyle } from "@/types";

export type BBoxToolTheme = {
  bboxStyle?: BBoxStyle;
};

export const DefaultBBoxToolTheme: BBoxToolTheme = {
  bboxStyle: {
    border: "1px solid blue",
    backgroundColor: "blue",
    opacity: 0.5,
  },
};
