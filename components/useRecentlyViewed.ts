"use client";

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
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      setSlugs(stored ? (JSON.parse(stored) as string[]) : []);
    } catch {
      setSlugs([]);
    }

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
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      const current: string[] = stored ? JSON.parse(stored) : [];
      const next = [slug, ...current.filter((s) => s !== slug)].slice(0, MAX_ITEMS);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Storage unavailable; skip silently.
    }
  }, [slug]);

  useEffect(() => {
    record();
  }, [record]);
}
