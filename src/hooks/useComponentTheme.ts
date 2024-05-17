import { useGlobalStore } from "@/store/globalStore";
import { MapTheme, ThemeComponentType } from "@/theme";

const useComponentTheme = <T extends ThemeComponentType>(
  component: T,
  override?: MapTheme[T]
): MapTheme[T] => {
  const theme = useGlobalStore((store) => store.theme);
  const componentTheme = theme ? theme[component] : {};
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
