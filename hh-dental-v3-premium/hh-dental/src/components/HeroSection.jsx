import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SITE_STATS } from "../data/mockData";
import { useLanguage } from "../context/LanguageContext";

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=1600&q=80"
          alt=""
          className="h-screen min-h-[720px] w-full object-cover"
        />
        <div className="hero-overlay absolute inset-0" />
      </div>

      <div className="container-shell relative flex min-h-screen items-center py-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl pt-16"
          >
            <p className="eyebrow mb-5">{t("home.heroEyebrow")}</p>
            <h1 className="luxury-title">{t("home.heroTitle")}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">{t("home.heroBody")}</p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/book-appointment" className="cta-primary">
                {t("common.bookNow")}
              </Link>
              <Link to="/services" className="cta-secondary">
                {t("home.heroSecondary")}
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="glass-panel mt-12 rounded-[32px] p-4 lg:mt-0 lg:p-6"
          >
            <div className="image-mask h-[320px] lg:h-[520px] rounded-[28px]">
              <img
                src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1200&q=80"
                alt="Dental consultation"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4">
              {SITE_STATS.map((item) => (
                <div key={item.label} className="rounded-[24px] border border-[rgba(240,214,156,0.12)] bg-[rgba(255,255,255,0.035)] p-4">
                  <p className="text-2xl font-semibold text-[var(--gold-soft)]">{item.value}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{item.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
