import { useCallback, useEffect, useRef, useState } from "react";
import { socket } from "../utils/socket";

type UseRealtimeCollectionOptions<T> = {
  eventName: string;
  initialData?: T[];
  pollingMs?: number;
};

const DEFAULT_POLLING_MS = 30000;

const normalizeCollection = <T,>(value: unknown, fallback: T[] = []): T[] => {
  if (Array.isArray(value)) {
    return value as T[];
  }

  if (value && typeof value === "object" && Array.isArray((value as { data?: unknown }).data)) {
    return (value as { data: T[] }).data;
  }

  return fallback;
};

export function useRealtimeCollection<T>(
  fetcher: () => Promise<T[]>,
  options: UseRealtimeCollectionOptions<T>
) {
  const { eventName, pollingMs = DEFAULT_POLLING_MS } = options;
  const initialDataRef = useRef<T[]>(options.initialData ?? ([] as T[]));
  const initialData = initialDataRef.current;
  const [data, setData] = useState<T[]>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const debounceRef = useRef<number | null>(null);
  const isMountedRef = useRef(true);
  const isFetchingRef = useRef(false);

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
    }

    try {
      const result = await fetcher();
      if (isMountedRef.current) {
        setData(normalizeCollection<T>(result, initialData));
        setError(null);
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err instanceof Error ? err : new Error("Failed to load data"));
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
      isFetchingRef.current = false;
    }
  }, [fetcher]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const handleUpdate = (payload: T[]) => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }

      debounceRef.current = window.setTimeout(() => {
        setData(normalizeCollection<T>(payload, initialData));
        setLoading(false);
      }, 150);
    };

    socket.on(eventName, handleUpdate);

    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }
      socket.off(eventName, handleUpdate);
    };
  }, [eventName]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      if (!socket.connected) {
        void load();
      }
    }, pollingMs);

    return () => window.clearInterval(intervalId);
  }, [load, pollingMs]);

  return { data, loading, error, reload: load, setData };
}
