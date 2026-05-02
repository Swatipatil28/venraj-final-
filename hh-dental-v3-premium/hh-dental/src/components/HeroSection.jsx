import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SITE_STATS } from "../data/mockData";
import { useLanguage } from "../context/LanguageContext";

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-[#0F172A]">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 z-10"
          style={{
            background: "linear-gradient(to right, rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.4))",
          }}
        />
        <img
          src="https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=1600&q=80"
          alt=""
          className="h-[85vh] min-h-[600px] w-full object-cover"
        />
      </div>

      <div className="container-shell relative z-20 flex min-h-[85vh] items-center px-6 py-[60px] sm:px-10 sm:py-[80px]">
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl text-center md:text-left"
        >
          <p className="eyebrow mb-6 inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-[#CBD5F5] backdrop-blur-md sm:text-sm">
            {t("home.heroEyebrow")}
          </p>
          <h1 className="mb-6 text-3xl font-bold leading-[1.2] text-white sm:text-4xl md:text-5xl lg:text-6xl">
            {t("home.heroTitle")}
          </h1>
          <p className="mb-10 mx-auto md:mx-0 max-w-xl text-base text-[#CBD5F5] sm:text-lg">
            {t("home.heroBody")}
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center md:justify-start">
            <Link to="/book-appointment" className="cta-primary w-full sm:w-auto">
              {t("common.bookNow")}
            </Link>
            <Link to="/services" className="rounded-lg border-2 border-white/20 bg-white/5 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-white/10 hover:border-white/30 backdrop-blur-sm w-full sm:w-auto text-center">
              {t("home.heroSecondary")}
            </Link>
          </div>
          
          <div className="mt-12 sm:mt-16 grid grid-cols-2 sm:grid-cols-3 gap-6 border-t border-white/10 pt-8">
            {SITE_STATS.slice(0, 3).map((item, idx) => (
              <div key={item.label} className={idx === 2 ? "col-span-2 sm:col-span-1" : ""}>
                <p className="text-2xl sm:text-3xl font-bold text-[#2E86AB]">{item.value}</p>
                <p className="mt-2 text-xs sm:text-sm text-[#CBD5F5]">{item.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
