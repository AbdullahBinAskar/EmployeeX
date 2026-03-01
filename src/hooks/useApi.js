import { useState, useEffect, useCallback } from 'react';
import { cacheGet, cacheSet, cacheIsStale, cacheInvalidateMany } from './useCache.js';

export function useApi(fetcher, deps = [], { cacheKey, staleTime = 60000 } = {}) {
  const [data, setData] = useState(() => {
    if (cacheKey) {
      const cached = cacheGet(cacheKey);
      return cached ? cached.data : null;
    }
    return null;
  });
  const [loading, setLoading] = useState(() => {
    if (cacheKey) {
      const cached = cacheGet(cacheKey);
      return !cached;
    }
    return true;
  });
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    // Stale-while-revalidate: if cache exists, show it immediately
    if (cacheKey) {
      const cached = cacheGet(cacheKey);
      if (cached) {
        setData(cached.data);
        // Only show loading if no cached data
        if (!cacheIsStale(cacheKey, staleTime)) {
          setLoading(false);
          return; // Cache is fresh, no refetch needed
        }
        // Cache is stale, refetch in background (no loading spinner)
      } else {
        setLoading(true);
      }
    } else {
      setLoading(true);
    }

    setError(null);
    try {
      const result = await fetcher();
      setData(result);
      if (cacheKey) cacheSet(cacheKey, result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { execute(); }, [execute]);

  return { data, loading, error, refetch: execute };
}

export function useMutation(mutator, { invalidates } = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await mutator(...args);
      if (invalidates) cacheInvalidateMany(invalidates);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mutator]);

  return { execute, loading, error };
}
