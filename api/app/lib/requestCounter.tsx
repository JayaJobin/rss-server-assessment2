declare global {
  // eslint-disable-next-line no-var
  var __rssServerRequestCount: number | undefined;
}

export function incrementRequestCount(): number {
  globalThis.__rssServerRequestCount = (globalThis.__rssServerRequestCount ?? 0) + 1;
  return globalThis.__rssServerRequestCount;
}

export function getRequestCount(): number {
  return globalThis.__rssServerRequestCount ?? 0;
}
