let requestCount = 0;

export function incrementRequestCount() {
  requestCount++;
  return requestCount;
}

export function getRequestCount() {
  return requestCount;
}
