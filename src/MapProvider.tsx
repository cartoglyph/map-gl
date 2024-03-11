import React from "react";
import { Provider, useSetAtom } from "jotai";
import { globalStore } from "./store";
import { MapTheme } from "./theme";
import store from "@/store";

type MapProviderProps = {
  children?: React.ReactNode;
  theme?: MapTheme;
};

/** Global map-gl provider */
export const MapProvider: React.FC<MapProviderProps> = ({
  children,
  theme,
}) => {
  return (
    <Provider store={globalStore}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </Provider>
  );
};

const ThemeProvider: React.FC<MapProviderProps> = ({ children, theme }) => {
  const setTheme = useSetAtom(store.theme.themeAtom, { store: globalStore });
  React.useEffect(() => {
    setTheme((prev) => ({ ...prev, ...theme }));
  }, [theme]);
  return <>{children}</>;
};
