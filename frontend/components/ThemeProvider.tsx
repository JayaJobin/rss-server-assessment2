"use client";
import { localStorageUtil } from "@/lib/storageUtil";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setLight: () => void;
  setDark: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  toggleTheme: () => {},
  setLight: () => {},
  setDark: () => {},
});

const STORAGE_KEY = "rss-server-theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Default matches the inline script in layout.tsx so there is no
  // mismatch between server-rendered markup and the client on hydration.
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = localStorageUtil.get<Theme | null>(STORAGE_KEY, null);
    if (stored === "light" || stored === "dark") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTheme(stored);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorageUtil.set(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const setLight = useCallback(() => setTheme("light"), []);
  const setDark = useCallback(() => setTheme("dark"), []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setLight, setDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
