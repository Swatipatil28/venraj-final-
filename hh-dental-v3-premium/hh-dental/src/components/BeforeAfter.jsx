import { useState } from "react";
import { motion } from "framer-motion";
import { BEFORE_AFTER_CASES } from "../data/mockData";
import SectionIntro from "./SectionIntro";
import { useLanguage } from "../context/LanguageContext";

export default function BeforeAfter() {
  const { t } = useLanguage();
  const [caseIndex, setCaseIndex] = useState(0);
  const [position, setPosition] = useState(52);
  const activeCase = BEFORE_AFTER_CASES[caseIndex];

  return (
    <section className="section-pad">
      <div className="container-shell">
        <SectionIntro
          eyebrow={t("home.sectionStories")}
          title="Interactive before-and-after stories that feel tangible."
          body="Preview how whitening, veneer design, and cosmetic refinement can shift confidence as much as appearance."
        />

        <div className="grid gap-8 lg:grid-cols-[0.44fr_0.56fr]">
          <div className="space-y-4">
            {BEFORE_AFTER_CASES.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setCaseIndex(index)}
                className={`glass-panel surface-hover block w-full rounded-[24px] p-5 text-left ${
                  caseIndex === index ? "border-[rgba(240,214,156,0.3)]" : ""
                }`}
              >
                <p className="eyebrow mb-2">Case {index + 1}</p>
                <h3 className="text-3xl">{item.label}</h3>
              </button>
            ))}
          </div>

          <motion.div layout className="glass-panel rounded-[24px] sm:rounded-[32px] p-4 sm:p-5 md:p-6">
            <div className="relative overflow-hidden rounded-[20px] sm:rounded-[26px]">
              <img src={activeCase.before} alt={`${activeCase.label} before`} className="h-[300px] sm:h-[400px] md:h-[460px] w-full object-cover" />
              <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${position}%` }}>
                <img src={activeCase.after} alt={`${activeCase.label} after`} className="h-[300px] sm:h-[400px] md:h-[460px] w-full max-w-none object-cover" style={{ width: `${100 / (position / 100)}%` }} />
              </div>
              <div className="absolute inset-y-0" style={{ left: `calc(${position}% - 1px)` }}>
                <div className="h-full w-0.5 bg-white/80" />
                <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[rgba(17,16,23,0.86)] text-xs text-white">
                  ↔
                </div>
              </div>
              <div className="absolute left-4 top-4 rounded-full bg-[rgba(11,10,15,0.72)] px-3 py-1 text-xs">Before</div>
              <div className="absolute right-4 top-4 rounded-full bg-[rgba(11,10,15,0.72)] px-3 py-1 text-xs">After</div>
            </div>

            <input
              type="range"
              min="5"
              max="95"
              value={position}
              onChange={(event) => setPosition(Number(event.target.value))}
              className="mt-6 w-full accent-[var(--primary)]"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
