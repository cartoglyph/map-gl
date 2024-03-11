import { useAtomValue } from "jotai";
import store, { globalStore } from "@/store";
import { MapTheme, ThemeComponentType } from "@/theme";

const useComponentTheme = <T extends ThemeComponentType>(
  component: T,
  override?: MapTheme[T]
): MapTheme[T] => {
  const theme = useAtomValue(store.theme.themeAtom, { store: globalStore });
  const componentTheme = theme[component];
  return Object.entries(componentTheme || {}).reduce((acc, [key, value]) => {
    if (override?.[key] !== undefined) {
      acc[key] = override[key];
    } else {
      acc[key] = value;
    }
    return acc;
  }, {});
};

export default useComponentTheme;
