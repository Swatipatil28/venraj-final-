import { useState, useEffect, useCallback } from "react";

/**
 * Generic hook for API calls with loading / error / data states.
 * @param {Function} apiFn   - async function to call
 * @param {any[]}    deps    - dependency array (re-fetches when changed)
 */
export const useApi = (apiFn, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFn();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
};

export default useApi;
