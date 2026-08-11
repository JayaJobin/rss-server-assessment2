"use client";
import { localStorageUtil } from "@/lib/storageUtil";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

interface LayoutContextValue {
  compact: boolean;
  setCompact: Dispatch<SetStateAction<boolean>>;
}

const LayoutContext = createContext<LayoutContextValue>({
  compact: false,
  setCompact: () => {},
});

const STORAGE_KEY = "rss-server-compact-layout";

export function LayoutPreferenceProvider({ children }: { children: ReactNode }) {
  const [compact, setCompactState] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCompactState(localStorageUtil.get(STORAGE_KEY, false));
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-compact", String(compact));
    localStorageUtil.set(STORAGE_KEY, compact);
  }, [compact]);

  return (
    <LayoutContext.Provider value={{ compact, setCompact: setCompactState }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayoutPreference() {
  return useContext(LayoutContext);
}
