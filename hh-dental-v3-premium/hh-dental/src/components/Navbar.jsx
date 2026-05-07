import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import logo from "../assets/logo.png";

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
            className={`relative rounded-full px-3 py-2 text-xs font-semibold transition ${active ? "text-white" : "text-[var(--muted)]"
              }`}
          >
            {active && (
              <motion.span
                layoutId="lang-toggle"
                className="absolute inset-0 rounded-full"
                style={{ background: "var(--primary)" }}
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
    const onScroll = () => setScrolled(window.scrollY > 20);
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
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
      scrolled || open 
        ? "bg-white/95 backdrop-blur-md shadow-lg py-1 md:py-2" 
        : "bg-white/80 backdrop-blur-sm py-3 md:py-4"
    }`}>
      <div className="container-shell">
        <div className="grid grid-cols-2 lg:grid-cols-3 items-center">
          
          {/* Logo Branding - Left Aligned */}
          <Link 
            to="/" 
            className="flex items-center justify-start gap-4 group transition-transform duration-300 hover:scale-[1.02]" 
            onClick={() => setOpen(false)}
          >
            <div className="relative h-[50px] w-[50px] sm:h-[60px] sm:w-[60px] lg:h-[70px] lg:w-[70px] shrink-0">
              <img 
                src={logo} 
                alt="H&H Dental Icon" 
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex flex-col justify-center border-l border-slate-200 pl-4">
              <h1 className="font-['Cinzel'] font-black text-xl sm:text-2xl lg:text-3xl tracking-tighter text-[#0F172A] leading-none">
                H&H <span className="text-[var(--primary)]">DENTAL</span>
              </h1>
              <p className="mt-1 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                Excellence in every smile
              </p>
            </div>
          </Link>

          {/* Navigation - Centered (Desktop Only) */}
          <nav className="hidden items-center justify-center gap-10 lg:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `relative py-1 text-sm font-bold tracking-widest uppercase transition-all duration-300 ${
                    isActive 
                      ? "text-[var(--primary)]" 
                      : "text-slate-600 hover:text-[var(--primary)]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    {isActive && (
                      <motion.span 
                        layoutId="nav-underline"
                        className="absolute -bottom-1 left-0 h-0.5 w-full bg-[var(--primary)] rounded-full"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Language & CTA - Right Aligned */}
          <div className="flex items-center justify-end gap-4 sm:gap-8">
            <div className="hidden sm:block">
              <LanguageToggle />
            </div>
            <Link 
              to="/book-appointment" 
              className="cta-primary hidden lg:inline-flex px-8 py-3.5 text-sm font-black shadow-primary-md hover:shadow-primary-lg active:scale-95 transition-all"
            >
              {t("nav.book")}
            </Link>
            
            {/* Mobile Actions */}
            <div className="flex items-center gap-3 lg:hidden">
              <Link 
                to="/book-appointment" 
                className="cta-primary px-4 py-2 text-[10px] font-black uppercase tracking-wider"
              >
                {t("nav.book")}
              </Link>
              <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-slate-50/50 shadow-sm transition-colors hover:bg-slate-100"
                aria-label="Toggle navigation"
              >
                <div className="relative h-5 w-5">
                  <span className={`absolute left-0 top-1/2 block h-0.5 w-5 -translate-y-1/2 rounded-full bg-slate-900 transition-transform duration-300 ${open ? "rotate-45" : "-translate-y-[6px]"}`} />
                  <span className={`absolute left-0 top-1/2 block h-0.5 w-5 -translate-y-1/2 rounded-full bg-slate-900 transition-opacity duration-300 ${open ? "opacity-0" : "opacity-100"}`} />
                  <span className={`absolute left-0 top-1/2 block h-0.5 w-5 -translate-y-1/2 rounded-full bg-slate-900 transition-transform duration-300 ${open ? "-rotate-45" : "translate-y-[6px]"}`} />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden bg-white/95 backdrop-blur-lg border-t border-slate-100"
            >
              <div className="py-12 px-6 flex flex-col items-center gap-8">
                {navItems.map((item, idx) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <NavLink
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) => 
                        `text-2xl font-black uppercase tracking-widest transition-colors ${
                          isActive ? "text-[var(--primary)]" : "text-slate-400 hover:text-slate-900"
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  </motion.div>
                ))}
                <div className="mt-6 sm:hidden pt-8 border-t border-slate-100 w-full flex justify-center">
                  <LanguageToggle />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
