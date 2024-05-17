"use client";

import React from "react";
import { type StoreApi } from "zustand";
import {
  type GlobalStore,
  createGlobalStore,
  GlobalStoreContext,
} from "@/store/globalStore";
import { MapTheme } from "@/theme";

const GlobalProvider: React.FC<{
  children: React.ReactNode;
  theme?: MapTheme;
}> = ({ children, theme }) => {
  const storeRef = React.useRef<StoreApi<GlobalStore>>();

  if (!storeRef.current) {
    storeRef.current = createGlobalStore({ theme });
  }

  return (
    <GlobalStoreContext.Provider value={storeRef.current}>
      {children}
    </GlobalStoreContext.Provider>
  );
};

export default GlobalProvider;
