import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="glass-panel hidden rounded-full p-1 md:flex">
      {[
        { id: "en", label: "EN" },
        { id: "te", label: "తెలు" },
      ].map((item) => {
        const active = language === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setLanguage(item.id)}
            className={`relative rounded-full px-3 py-2 text-xs font-semibold transition ${
              active ? "text-[#130f0a]" : "text-[rgba(245,238,227,0.72)]"
            }`}
          >
            {active && (
              <motion.span
                layoutId="lang-toggle"
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

export default function Navbar() {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { to: "/", label: t("nav.home") },
    { to: "/services", label: t("nav.services") },
    { to: "/doctors", label: t("nav.doctors") },
    { to: "/locations", label: t("nav.locations") },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <div
        className={`container-shell transition-all duration-300 ${
          scrolled ? "glass-panel rounded-[28px] py-3" : "py-2"
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-full"
              style={{
                background: "linear-gradient(135deg, rgba(216,180,106,0.2), rgba(211,154,149,0.16))",
                border: "1px solid rgba(240,214,156,0.22)",
              }}
            >
              <span className="font-['Cinzel'] text-sm text-gradient">H&H</span>
            </div>
            <div>
              <p className="font-['Cinzel'] text-sm tracking-[0.18em] text-[rgba(245,238,227,0.92)]">H&H Dental</p>
              <p className="text-xs text-[rgba(245,238,227,0.52)]">Premium smile care</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `text-sm transition ${isActive ? "text-[var(--gold-soft)]" : "text-[rgba(245,238,227,0.76)] hover:text-white"}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <LanguageToggle />
            <Link to="/book-appointment" className="cta-primary hidden sm:inline-flex">
              {t("nav.book")}
            </Link>
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              className="glass-panel inline-flex h-11 w-11 items-center justify-center rounded-full lg:hidden"
              aria-label="Toggle navigation"
            >
              <span className="space-y-1.5">
                <span className="block h-0.5 w-5 rounded-full bg-[var(--text)]" />
                <span className="block h-0.5 w-5 rounded-full bg-[var(--text)]" />
                <span className="block h-0.5 w-5 rounded-full bg-[var(--text)]" />
              </span>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden lg:hidden"
            >
              <div className="mt-4 space-y-3 border-t border-[rgba(240,214,156,0.14)] pt-4">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="block rounded-2xl px-4 py-3 text-sm text-[rgba(245,238,227,0.8)] transition hover:bg-[rgba(255,255,255,0.04)]"
                  >
                    {item.label}
                  </NavLink>
                ))}
                <Link to="/book-appointment" onClick={() => setOpen(false)} className="cta-primary flex w-full">
                  {t("nav.book")}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
