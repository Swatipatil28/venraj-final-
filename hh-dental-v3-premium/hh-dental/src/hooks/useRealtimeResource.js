import { useCallback, useEffect, useRef, useState } from "react";
import socket from "../utils/socket";

const DEFAULT_POLLING_MS = 30000;

const normalizeCollection = (value, fallback = []) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (Array.isArray(value?.data)) {
    return value.data;
  }

  return fallback;
};

export function useRealtimeResource(fetcher, options = {}) {
  const {
    eventName,
    pollingMs = DEFAULT_POLLING_MS,
  } = options;

  const initialDataRef = useRef(options.initialData ?? []);
  const initialData = initialDataRef.current;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const timeoutRef = useRef(null);
  const isMountedRef = useRef(true);
  const isFetchingRef = useRef(false);

  // Must be first effect so isMountedRef is true before boot runs
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const load = useCallback(async (isInitial = false) => {
    if (isFetchingRef.current) {
      console.log(`[useRealtimeResource] Fetch already in progress, skipping.`);
      return;
    }

    isFetchingRef.current = true;
    if (isMountedRef.current) {
      setLoading(true);
    }

    try {
      console.log(`[useRealtimeResource] Fetching data...`);
      const result = await fetcher();
      console.log(`[useRealtimeResource] Fetch success:`, result);
      
      if (isMountedRef.current) {
        const normalized = normalizeCollection(result, initialData);
        setData(normalized);
        setError(null);
      }
    } catch (err) {
      console.error(`[useRealtimeResource] Fetch failed:`, err);
      if (isMountedRef.current) {
        setError(err);
        // Only reset to initial data if it's the very first fetch
        if (isInitial) {
          setData(initialData);
        }
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
      isFetchingRef.current = false;
    }
  }, [fetcher, initialData]);

  // Initial load
  useEffect(() => {
    let isActive = true;
    console.log(`[useRealtimeResource] Initial mount, calling load().`);
    
    const run = async () => {
      await load(true);
    };
    
    run();

    return () => {
      isActive = false;
      console.log(`[useRealtimeResource] Unmounting.`);
    };
  }, [load]);

  // Real-time socket event listener
  useEffect(() => {
    if (!eventName) {
      return undefined;
    }

    const applyUpdate = (payload) => {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        setData(normalizeCollection(payload, initialData));
        setLoading(false);
      }, 150);
    };

    socket.on(eventName, applyUpdate);

    return () => {
      window.clearTimeout(timeoutRef.current);
      socket.off(eventName, applyUpdate);
    };
  }, [eventName]);

  // Polling fallback — only fires when socket is disconnected
  useEffect(() => {
    const poll = () => {
      if (!socket.connected) {
        void load();
      }
    };

    const intervalId = window.setInterval(poll, pollingMs);
    return () => window.clearInterval(intervalId);
  }, [load, pollingMs]);

  return { data, loading, error, reload: load, setData };
}
