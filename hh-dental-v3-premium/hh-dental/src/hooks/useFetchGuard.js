import { useCallback, useRef } from 'react';

export function useFetchGuard() {
  const isFetchingRef = useRef(false);

  const guardedFetch = useCallback(async (fn) => {
    if (isFetchingRef.current) {
      return undefined;
    }

    isFetchingRef.current = true;
    try {
      return await fn();
    } finally {
      isFetchingRef.current = false;
    }
  }, []);

  return { guardedFetch };
}
