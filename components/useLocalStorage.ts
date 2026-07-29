"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";

// Small reusable hook that mirrors a piece of state into localStorage.
// Used for settings such as the hamburger menu's last state and the
// compact-layout preference on the Settings page.
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored !== null) {
        setValue(JSON.parse(stored) as T);
      }
    } catch {
      // Ignore malformed storage values and fall back to the default.
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage may be unavailable (private browsing, quota); fail silently.
    }
  }, [key, value, hydrated]);

  return [value, setValue];
}
