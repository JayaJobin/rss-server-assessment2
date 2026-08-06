"use client";
import { localStorageUtil } from "@/lib/storageUtil";
import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "rss-server-recently-viewed";
const MAX_ITEMS = 5;

// Tracks the last few post slugs a visitor opened, persisted to
// localStorage. `recordView` is called from the post page; the slug
// list itself is read anywhere it needs to be displayed (Home sidebar,
// Feeds sidebar) via `useRecentlyViewedSlugs`.
export function useRecentlyViewedSlugs(): string[] {
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
  setSlugs(localStorageUtil.get<string[]>(STORAGE_KEY, []));

    // Keep this in sync if another tab / the post page updates it.
    function onStorage(event: StorageEvent) {
      if (event.key === STORAGE_KEY) {
        try {
          setSlugs(event.newValue ? (JSON.parse(event.newValue) as string[]) : []);
        } catch {
          setSlugs([]);
        }
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return slugs;
}

export function useRecordRecentlyViewed(slug: string): void {
  const record = useCallback(() => {
  const current = localStorageUtil.get<string[]>(STORAGE_KEY, []);
  const next = [slug, ...current.filter((s) => s !== slug)].slice(0, MAX_ITEMS);
  localStorageUtil.set(STORAGE_KEY, next);
}, [slug]);

  useEffect(() => {
    record();
  }, [record]);
}
