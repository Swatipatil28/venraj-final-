import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SITE_STATS } from "../data/mockData";
import { useLanguage } from "../context/LanguageContext";

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-[#0F172A] min-h-[70vh] sm:min-h-[85vh] lg:min-h-[95vh] flex items-center pt-20">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 z-10"
          style={{
            background: "linear-gradient(to right, rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.45), transparent)",
          }}
        />
        <img
          src="https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=1600&q=80"
          alt="Premium Dental Clinic"
          className="h-full w-full object-cover scale-105 animate-slow-zoom"
        />
      </div>

      <div className="container-shell relative z-20 px-6 py-20 sm:px-12 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl text-center md:text-left"
        >
          <p className="mb-6 inline-block rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 px-6 py-2.5 text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-white backdrop-blur-md">
            {t("home.heroEyebrow")}
          </p>
          <h1 className="mb-8 text-5xl font-black leading-[1.05] text-white sm:text-7xl md:text-8xl lg:text-9xl tracking-tightest">
            {t("home.heroTitle")}
          </h1>
          <p className="mb-12 mx-auto md:mx-0 max-w-2xl text-lg text-slate-300 sm:text-xl md:text-2xl font-medium leading-relaxed">
            {t("home.heroBody")}
          </p>

          <div className="flex flex-col gap-6 sm:flex-row sm:justify-center md:justify-start">
            <Link to="/book-appointment" className="cta-primary px-12 py-5 text-lg font-black tracking-wide shadow-primary-lg hover:shadow-primary-xl transform hover:-translate-y-1">
              {t("common.bookNow")}
            </Link>
            <Link to="/services" className="rounded-2xl border-2 border-white/20 bg-white/5 px-12 py-5 text-lg font-black text-white transition-all hover:bg-white/10 hover:border-white/40 backdrop-blur-md w-full sm:w-auto text-center">
              {t("home.heroSecondary")}
            </Link>
          </div>
          
          <div className="mt-20 sm:mt-32 grid grid-cols-2 sm:grid-cols-3 gap-12 border-t border-white/10 pt-12">
            {SITE_STATS.slice(0, 3).map((item, idx) => (
              <div key={item.label} className={idx === 2 ? "col-span-2 sm:col-span-1" : ""}>
                <p className="text-4xl sm:text-5xl font-black text-[var(--primary)] tracking-tighter">{item.value}</p>
                <p className="mt-4 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
