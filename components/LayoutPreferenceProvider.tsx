"use client";

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
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      setCompactState(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-compact", String(compact));
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(compact));
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
