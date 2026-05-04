import { motion } from "framer-motion";

export default function PageHero({ image, eyebrow, title, body, chips = [] }) {
  return (
    <section className="relative overflow-hidden bg-[#0F172A]">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 z-10"
          style={{
            background: "linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.7) 50%, rgba(15, 23, 42, 0.4) 100%)",
          }}
        />
        <img src={image} alt="" className="h-[70vh] min-h-[500px] w-full object-cover" />
      </div>

      <div className="container-shell relative z-20 flex min-h-[50vh] sm:min-h-[72vh] items-center sm:items-end px-6 sm:px-10 py-20 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl pb-4 text-center md:text-left mx-auto md:mx-0 w-full"
        >
          <p className="eyebrow mb-4 sm:mb-5 text-[#2E86AB] text-[10px] sm:text-sm font-bold tracking-[0.2em]">{eyebrow}</p>
          <h1 className="text-3xl leading-[1.1] sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 sm:mb-8 tracking-tight">
            {title}
          </h1>
          <p className="mx-auto md:mx-0 max-w-2xl text-sm sm:text-lg leading-relaxed text-slate-300 font-medium">
            {body}
          </p>
          
          {chips.length ? (
            <div className="mt-10 sm:mt-12 flex flex-wrap justify-center md:justify-start gap-2 sm:gap-4">
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full bg-white/10 border border-white/20 backdrop-blur-md px-4 py-2 text-[10px] sm:text-sm font-bold uppercase tracking-widest text-white transition-all duration-300 hover:bg-[var(--primary)] hover:border-[var(--primary)] cursor-pointer"
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
