import { motion } from "framer-motion";

export default function PageHero({ image, eyebrow, title, body, chips = [] }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={image} alt="" className="h-[72vh] min-h-[520px] w-full object-cover" />
        <div className="hero-overlay absolute inset-0" />
      </div>

      <div className="container-shell relative flex min-h-[72vh] items-end py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl pb-4"
        >
          <p className="eyebrow mb-4">{eyebrow}</p>
          <h1 className="luxury-title max-w-4xl">{title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">{body}</p>
          {chips.length ? (
            <div className="mt-8 flex flex-wrap gap-3">
              {chips.map((chip) => (
                <span key={chip} className="pill-chip">
                  {chip}
                </span>
              ))}
            </div>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}
