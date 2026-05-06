import { useCallback, useEffect, useRef, useState } from "react";

export function useApiResource(fetcher, fallbackData = [], deps = []) {
  const [data, setData] = useState(fallbackData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMountedRef = useRef(true);
  const isFetchingRef = useRef(false);

  // Must be first effect so isMountedRef is true before load runs
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const load = useCallback(async () => {
    if (isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;
    if (isMountedRef.current) {
      setLoading(true);
      setError(null);
    }

    try {
      const result = await fetcher();
      if (isMountedRef.current) {
        const parsedData = Array.isArray(result)
          ? result
          : result?.data
            ? result.data
            : [];
        setData(parsedData);
      }
    } catch (err) {
      if (isMountedRef.current) {
        setData([]);
        setError(err);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
      isFetchingRef.current = false;
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  // Use isActive flag to discard stale results (no AbortController — safe with pendingRequests cache)
  useEffect(() => {
    let ignore = false;

    const run = async () => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;
      if (isMountedRef.current) {
        setLoading(true);
        setError(null);
      }
      try {
        const result = await fetcher();
        if (!ignore && isMountedRef.current) {
          const parsedData = Array.isArray(result)
            ? result
            : result?.data
              ? result.data
              : [];
          setData(parsedData);
        }
      } catch (err) {
        if (!ignore && isMountedRef.current) {
          setData([]);
          setError(err);
        }
      } finally {
        if (!ignore && isMountedRef.current) {
          setLoading(false);
        }
        isFetchingRef.current = false;
      }
    };

    run();

    return () => {
      ignore = true;
    };
  }, [load]);

  const reload = () => load();

  return { data, loading, error, reload, setData };
}
