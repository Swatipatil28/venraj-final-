import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getTestimonials } from "../services/api.service";
import SectionIntro from "./SectionIntro";
import { useLanguage } from "../context/LanguageContext";

export default function Testimonials() {
  const { t } = useLanguage();
  const [index, setIndex] = useState(0);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let timer;
    getTestimonials().then((data) => {
      setTestimonials(data);
      setLoading(false);
      if (data && data.length > 0) {
        timer = window.setInterval(() => {
          setIndex((prev) => (prev + 1) % data.length);
        }, 5000);
      }
    }).catch((err) => {
      console.error(err);
      setLoading(false);
    });

    return () => {
      if (timer) window.clearInterval(timer);
    };
  }, []);

  if (loading) return null;

  return (
    <section className="section-pad">
      <div className="container-shell">
        <SectionIntro
          eyebrow={t("home.sectionTestimonials")}
          title="Patients book for results, then remember how effortless the care felt."
          body="The design goal is trust and conversion, so social proof sits close to the booking path rather than buried in the footer."
          align="center"
        />

        {testimonials.length === 0 ? (
          <div className="glass-panel mx-auto max-w-4xl rounded-[34px] p-8 text-center md:p-12">
            <p className="text-xl text-[var(--muted)]">No reviews yet.</p>
          </div>
        ) : (
          <div className="glass-panel mx-auto max-w-4xl rounded-[34px] p-8 text-center md:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonials[index]?._id || testimonials[index]?.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
              >
                <p className="text-2xl leading-10 md:text-3xl">
                  “{testimonials[index]?.quote}”
                </p>
                <p className="mt-6 text-sm uppercase tracking-[0.18em] text-[var(--gold-soft)]">
                  {testimonials[index]?.name} • {testimonials[index]?.treatment}
                </p>
              </motion.div>
            </AnimatePresence>

            {testimonials.length > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                {testimonials.map((item, itemIndex) => (
                  <button
                    key={item._id || item.id}
                    type="button"
                    onClick={() => setIndex(itemIndex)}
                    className="h-2.5 w-10 rounded-full"
                    style={{ background: itemIndex === index ? "var(--gold)" : "rgba(255,255,255,0.12)" }}
                    aria-label={`Show testimonial ${itemIndex + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
