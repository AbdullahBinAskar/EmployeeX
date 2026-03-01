const cache = new Map();

const DEFAULT_STALE_TIME = 60000; // 60 seconds

export function cacheGet(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  return entry;
}

export function cacheSet(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

export function cacheIsStale(key, staleTime = DEFAULT_STALE_TIME) {
  const entry = cache.get(key);
  if (!entry) return true;
  return Date.now() - entry.timestamp > staleTime;
}

export function cacheInvalidate(key) {
  cache.delete(key);
}

export function cacheInvalidateAll() {
  cache.clear();
}

export function cacheInvalidateMany(keys) {
  keys.forEach(key => cache.delete(key));
}
