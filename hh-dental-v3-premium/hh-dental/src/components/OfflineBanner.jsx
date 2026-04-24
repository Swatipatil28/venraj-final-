import { useEffect, useState } from "react";

export default function OfflineBanner() {
  const [online, setOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);

  useEffect(() => {
    const toOnline = () => setOnline(true);
    const toOffline = () => setOnline(false);
    window.addEventListener("online", toOnline);
    window.addEventListener("offline", toOffline);
    return () => {
      window.removeEventListener("online", toOnline);
      window.removeEventListener("offline", toOffline);
    };
  }, []);

  if (online) return null;

  return (
    <div className="fixed left-1/2 top-[5.25rem] z-[65] -translate-x-1/2 rounded-full border border-amber-300/30 bg-amber-400/15 px-4 py-2 text-xs text-amber-100 backdrop-blur">
      Offline mode active. Using cached and mock data.
    </div>
  );
}
