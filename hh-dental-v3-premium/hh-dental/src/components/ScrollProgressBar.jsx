import { useState, useEffect } from "react";
export default function ScrollProgressBar() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const fn = () => {
      const d = document.documentElement.scrollHeight - window.innerHeight;
      setP(d > 0 ? (window.scrollY / d) * 100 : 0);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-px">
      <div className="h-full transition-all duration-100"
        style={{ width:`${p}%`, background:"linear-gradient(90deg,#D4AF37,#F0E4A0)" }} />
    </div>
  );
}
