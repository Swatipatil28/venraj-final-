import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

export default function ServiceCard({ service }) {
  const { t } = useLanguage();

  return (
    <motion.article
      whileHover={{ y: -12 }}
      className="glass-panel group overflow-hidden rounded-[32px] border border-slate-100 bg-white shadow-sm transition-all duration-500 hover:shadow-primary-md hover:border-[var(--primary)]/20"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={service.image || service.imageUrl || "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80"}
          alt={service.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => { 
            e.target.src = "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80"; 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>

      <div className="flex flex-col p-6 sm:p-8">
        <div className="mb-6">
          <span className="inline-block rounded-full bg-[var(--primary)]/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--primary)] mb-4">
            {service.category}
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] leading-tight mb-3 transition-colors group-hover:text-[var(--primary)]">
            {service.title}
          </h3>
          <p className="text-sm leading-relaxed text-[#64748B] line-clamp-3 font-medium">
            {service.shortDescription || service.description}
          </p>
        </div>
        
        <Link 
          to={`/services/${service.id}`} 
          className="mt-auto inline-flex items-center gap-3 text-sm font-bold text-[var(--primary)] transition-all group/link"
        >
          <span className="relative">
            {t("common.learnMore")}
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-[var(--primary)] transition-all duration-300 group-hover/link:w-full" />
          </span>
          <motion.span 
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-lg"
          >
            →
          </motion.span>
        </Link>
      </div>
    </motion.article>
  );
}
