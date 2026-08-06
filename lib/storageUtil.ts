// storageUtil.ts
//
// Two separate, narrow helpers for two different jobs:
//
//  - localStorageUtil: client-only key/value data that never needs to be
//    read by the server and never needs to leave the browser. Used for
//    theme, compact-layout, last menu state, and recently-viewed posts.
//    Chosen over cookies for these because that data is (a) UI-only
//    preference, not something a request handler needs, (b) written on
//    almost every click/toggle, and cookies get re-sent to the server on
//    every request, which would be wasted bandwidth for values the
//    server never reads, (c) not sensitive, so it doesn't need an
//    expiry or server-side visibility.
//
//  - cookieUtil: small helper kept alongside it for the cases that *do*
//    belong in a cookie, e.g. anything Assessment 2's server needs to
//    see on the next request (auth/session state). Not used yet in this
//    frontend-only assessment, but kept here rather than mixed into the
//    localStorage helper so the two storage mechanisms stay clearly
//    separated instead of being interchangeable "just use whichever".

export const localStorageUtil = {
  get<T>(key: string, fallback: T): T {
    if (typeof window === "undefined") return fallback;
    try {
      const raw = window.localStorage.getItem(key);
      return raw !== null ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  },

  set<T>(key: string, value: T): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage may be unavailable (private browsing, quota exceeded).
      // Fail silently: the UI still works, it just won't persist.
    }
  },

  remove(key: string): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Ignore.
    }
  },
};

export const cookieUtil = {
  get(key: string): string | null {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(
      new RegExp(`(?:^|; )${key.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1")}=([^;]*)`)
    );
    return match ? decodeURIComponent(match[1]) : null;
  },

  set(key: string, value: string, days = 30): void {
    if (typeof document === "undefined") return;
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${key}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
  },

  remove(key: string): void {
    if (typeof document === "undefined") return;
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  },
};