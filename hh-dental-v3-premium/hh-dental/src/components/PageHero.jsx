import { motion } from "framer-motion";

export default function PageHero({ image, eyebrow, title, body, chips = [] }) {
  return (
    <section className="relative overflow-hidden bg-[#0F172A]">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 z-10"
          style={{
            background: "linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.4) 100%)",
          }}
        />
        <img src={image} alt="" className="h-[70vh] min-h-[500px] w-full object-cover" />
      </div>

      <div className="container-shell relative z-20 flex min-h-[60vh] sm:min-h-[75vh] items-center sm:items-end px-6 sm:px-12 py-24 sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl pb-4 text-center md:text-left mx-auto md:mx-0 w-full"
        >
          <p className="mb-6 inline-block rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 px-6 py-2 text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-white backdrop-blur-md">
            {eyebrow}
          </p>
          <h1 className="text-4xl leading-[1.05] sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-8 tracking-tightest">
            {title}
          </h1>
          <p className="mx-auto md:mx-0 max-w-2xl text-lg sm:text-xl md:text-2xl leading-relaxed text-slate-300 font-medium opacity-90">
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
