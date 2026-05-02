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
    let ignore = false;

    getTestimonials()
      .then((response) => {
        if (ignore) return;
        
        console.log("Testimonials API response:", response);
        
        // Ensure data is an array
        let dataArray = [];
        if (Array.isArray(response)) {
          dataArray = response;
        } else if (response && Array.isArray(response.data)) {
          dataArray = response.data;
        }
          
        setTestimonials(dataArray);
        setLoading(false);
        
        if (dataArray.length > 0) {
          timer = window.setInterval(() => {
            setIndex((prev) => (prev + 1) % dataArray.length);
          }, 5000);
        }
      })
      .catch((err) => {
        if (ignore) return;
        console.error("Testimonials fetch error:", err);
        setTestimonials([]);
        setLoading(false);
      });

    return () => {
      ignore = true;
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

        {!Array.isArray(testimonials) || testimonials.length === 0 ? (
          <div className="glass-panel mx-auto max-w-4xl rounded-[34px] p-8 text-center md:p-12">
            <p className="text-xl text-[var(--muted)]">No reviews yet.</p>
          </div>
        ) : (
          <div className="glass-panel mx-auto max-w-4xl rounded-[24px] sm:rounded-[34px] p-6 sm:p-8 md:p-12 text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonials[index]?._id || testimonials[index]?.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
              >
                <div className="mb-6 flex justify-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`h-5 w-5 sm:h-6 sm:w-6 ${
                        i < (testimonials[index]?.rating || 5) ? "text-[var(--primary)]" : "text-[var(--line)]"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-lg leading-relaxed sm:text-2xl sm:leading-10 md:text-3xl">
                  “{testimonials[index]?.quote}”
                </p>
                <p className="mt-4 sm:mt-6 text-[10px] sm:text-sm uppercase tracking-[0.1em] sm:tracking-[0.18em] text-[var(--secondary)] font-bold">
                  {testimonials[index]?.name} • {testimonials[index]?.treatment}
                </p>
              </motion.div>
            </AnimatePresence>

            {testimonials.length > 1 && (
              <div className="mt-6 sm:mt-8 flex justify-center gap-1.5 sm:gap-2 overflow-x-auto py-2 px-4 no-scrollbar">
                {testimonials.map((item, itemIndex) => (
                  <button
                    key={item._id || item.id || itemIndex}
                    type="button"
                    onClick={() => setIndex(itemIndex)}
                    className="h-1.5 sm:h-2.5 w-6 sm:w-10 rounded-full flex-shrink-0"
                    style={{ background: itemIndex === index ? "var(--primary)" : "var(--line)" }}
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
