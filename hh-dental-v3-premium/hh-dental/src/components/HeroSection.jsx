import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SITE_STATS } from "../data/mockData";
import { useLanguage } from "../context/LanguageContext";

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-[#0F172A] min-h-[60vh] sm:min-h-[80vh] lg:min-h-[90vh] flex items-center">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 z-10"
          style={{
            background: "linear-gradient(to right, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.4))",
          }}
        />
        <img
          src="https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=1600&q=80"
          alt="Premium Dental Clinic"
          className="h-full w-full object-cover scale-105 animate-slow-zoom"
        />
      </div>

      <div className="container-shell relative z-20 px-6 py-12 sm:px-10 sm:py-20 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-3xl text-center md:text-left"
        >
          <p className="eyebrow mb-8 inline-block rounded-full bg-[var(--primary)]/20 border border-[var(--primary)]/30 px-6 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md sm:text-sm">
            {t("home.heroEyebrow")}
          </p>
          <h1 className="mb-8 text-4xl font-black leading-[1.1] text-white sm:text-6xl md:text-7xl lg:text-8xl tracking-tight">
            {t("home.heroTitle")}
          </h1>
          <p className="mb-12 mx-auto md:mx-0 max-w-xl text-lg text-[#CBD5F5] sm:text-xl font-medium leading-relaxed">
            {t("home.heroBody")}
          </p>

          <div className="flex flex-col gap-5 sm:flex-row sm:justify-center md:justify-start">
            <Link to="/book-appointment" className="cta-primary px-10 py-5 text-lg shadow-primary-md hover:shadow-primary-lg transform hover:-translate-y-1">
              {t("common.bookNow")}
            </Link>
            <Link to="/services" className="rounded-xl border-2 border-white/30 bg-white/5 px-10 py-5 text-lg font-bold text-white transition-all hover:bg-white/10 hover:border-white/50 backdrop-blur-md w-full sm:w-auto text-center">
              {t("home.heroSecondary")}
            </Link>
          </div>
          
          <div className="mt-20 sm:mt-24 grid grid-cols-2 sm:grid-cols-3 gap-8 border-t border-white/10 pt-10">
            {SITE_STATS.slice(0, 3).map((item, idx) => (
              <div key={item.label} className={idx === 2 ? "col-span-2 sm:col-span-1" : ""}>
                <p className="text-3xl sm:text-4xl font-black text-[var(--primary)]">{item.value}</p>
                <p className="mt-3 text-xs sm:text-sm font-bold uppercase tracking-widest text-[#94A3B8]">{item.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
