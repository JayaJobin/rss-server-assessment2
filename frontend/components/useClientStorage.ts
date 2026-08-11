"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { localStorageUtil } from "@/lib/storageUtil";

export function useClientStorage<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValue(localStorageUtil.get(key, initialValue));
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    localStorageUtil.set(key, value);
  }, [key, value, hydrated]);

  return [value, setValue];
}
