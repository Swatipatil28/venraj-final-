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
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
      scrolled || open ? "bg-white shadow-lg py-3" : "py-4 md:py-6"
    }`}>
      <div className="container-shell">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 sm:gap-4 group" onClick={() => setOpen(false)}>
            <div className="relative h-12 w-12 sm:h-14 sm:w-14 overflow-hidden rounded-xl transition-transform duration-300 group-hover:scale-110">
              <img 
                src={logo} 
                alt="H&H Dental Logo" 
                className="h-full w-full object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <p className="font-['Cinzel'] font-black text-sm sm:text-xl tracking-[0.1em] text-[var(--text)] leading-none">H&H DENTAL</p>
              <p className="text-[8px] sm:text-[10px] uppercase tracking-widest text-[var(--primary)] font-bold mt-1">Excellence in every smile</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-10 lg:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `relative py-2 text-base font-semibold transition-all duration-300 ${
                    isActive 
                      ? "text-[var(--primary)]" 
                      : "text-[var(--muted)] hover:text-[var(--primary)]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    {isActive && (
                      <motion.span 
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-0 h-0.5 w-full bg-[var(--primary)] rounded-full"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3 sm:gap-4">
            <LanguageToggle />
            <Link to="/book-appointment" className="cta-primary hidden md:inline-flex shadow-primary-sm hover:shadow-primary-md">
              {t("nav.book")}
            </Link>
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full lg:hidden border border-[var(--line)] bg-slate-50 transition-colors hover:bg-slate-100"
              aria-label="Toggle navigation"
            >
              <div className="relative h-5 w-5">
                <span className={`absolute left-0 top-1/2 block h-0.5 w-5 -translate-y-1/2 rounded-full bg-[var(--text)] transition-transform duration-300 ${open ? "rotate-45" : "-translate-y-[6px]"}`} />
                <span className={`absolute left-0 top-1/2 block h-0.5 w-5 -translate-y-1/2 rounded-full bg-[var(--text)] transition-opacity duration-300 ${open ? "opacity-0" : "opacity-100"}`} />
                <span className={`absolute left-0 top-1/2 block h-0.5 w-5 -translate-y-1/2 rounded-full bg-[var(--text)] transition-transform duration-300 ${open ? "-rotate-45" : "translate-y-[6px]"}`} />
              </div>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "100vh" }}
              exit={{ opacity: 0, height: 0 }}
              className="fixed inset-0 top-[72px] z-40 bg-white lg:hidden overflow-y-auto"
            >
              <div className="container-shell py-12 flex flex-col items-center gap-10">
                <div className="flex flex-col items-center gap-6 w-full">
                  {navItems.map((item, idx) => (
                    <motion.div
                      key={item.to}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="w-full text-center"
                    >
                      <NavLink
                        to={item.to}
                        onClick={() => setOpen(false)}
                        className={({ isActive }) => 
                          `text-3xl font-bold tracking-tight transition-colors ${
                            isActive ? "text-[var(--primary)]" : "text-slate-400 hover:text-[var(--text)]"
                          }`
                        }
                      >
                        {item.label}
                      </NavLink>
                    </motion.div>
                  ))}
                </div>
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="w-full pt-10 border-t border-slate-100"
                >
                  <Link 
                    to="/book-appointment" 
                    onClick={() => setOpen(false)} 
                    className="cta-primary flex w-full py-5 text-xl"
                  >
                    {t("nav.book")}
                  </Link>
                </motion.div>

                <div className="flex items-center gap-8 text-slate-400 mt-auto pb-20">
                   <p className="text-xs font-bold uppercase tracking-widest">{t("nav.locations")}</p>
                   <div className="h-1 w-1 rounded-full bg-slate-300" />
                   <p className="text-xs font-bold uppercase tracking-widest">{t("nav.doctors")}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
