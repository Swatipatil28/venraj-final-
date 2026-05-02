import { useCallback, useEffect, useState } from "react";

export function useApiResource(fetcher, fallbackData = [], deps = []) {
  const [data, setData] = useState(fallbackData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async (ignore = false) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      if (!ignore) {
        // Ensure data is an array just in case the API returns { success: true, data: [...] }
        const parsedData = Array.isArray(result) 
          ? result 
          : (result?.data ? result.data : []);
        setData(parsedData);
      }
    } catch (err) {
      if (!ignore) {
        setData([]);
        setError(err);
      }
    } finally {
      if (!ignore) {
        setLoading(false);
      }
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let ignore = false;
    
    // Pass ignore flag to prevent state updates if unmounted
    load(ignore);

    return () => {
      ignore = true;
    };
  }, [load]);

  const reload = () => load(false);

  return { data, loading, error, reload };
}
