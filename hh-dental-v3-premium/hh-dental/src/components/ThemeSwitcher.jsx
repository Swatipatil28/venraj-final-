import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const THEMES = [
  { id: "charcoal-gold", label: "Charcoal" },
  { id: "navy-teal", label: "Navy" },
  { id: "plum-rose", label: "Plum" },
];

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("app-theme") || "charcoal-gold"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("app-theme", theme);
  }, [theme]);

  return (
    <div className="glass-panel hidden rounded-full p-1 md:flex">
      {THEMES.map((item) => {
        const active = theme === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setTheme(item.id)}
            className={`relative rounded-full px-3 py-2 text-xs font-semibold transition ${
              active ? "text-[#130f0a]" : "text-[rgba(245,238,227,0.72)]"
            }`}
          >
            {active && (
              <motion.span
                layoutId="theme-toggle"
                className="absolute inset-0 rounded-full"
                style={{ background: "linear-gradient(135deg, var(--gold-soft), var(--gold))" }}
              />
            )}
            <span className="relative z-10">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
