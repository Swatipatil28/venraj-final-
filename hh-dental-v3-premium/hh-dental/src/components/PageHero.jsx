import { motion } from "framer-motion";

export default function PageHero({ image, eyebrow, title, body, chips = [] }) {
  return (
    <section className="relative overflow-hidden bg-[#0F172A]">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 z-10"
          style={{
            background: "linear-gradient(to right, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.6) 100%)",
          }}
        />
        <img src={image} alt="" className="h-[72vh] min-h-[520px] w-full object-cover" />
      </div>

      <div className="container-shell relative z-20 flex min-h-[60vh] sm:min-h-[72vh] items-end px-6 sm:px-10 py-16 sm:py-20 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl pb-4 text-center md:text-left mx-auto md:mx-0"
        >
          <p className="eyebrow mb-4 sm:mb-5 text-[#2E86AB] text-xs sm:text-sm">{eyebrow}</p>
          <h1 className="text-3xl leading-tight sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
            {title}
          </h1>
          <p className="mx-auto md:mx-0 max-w-2xl text-base sm:text-lg leading-relaxed text-[#CBD5E1]">
            {body}
          </p>
          
          {chips.length ? (
            <div className="mt-8 sm:mt-10 flex flex-wrap justify-center md:justify-start gap-3 sm:gap-4">
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full bg-white px-4 py-1.5 sm:px-5 sm:py-2 text-[11px] sm:text-sm font-semibold text-[#1E293B] shadow-md transition-all duration-300 hover:bg-[#2E86AB] hover:text-white cursor-pointer"
                >
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
