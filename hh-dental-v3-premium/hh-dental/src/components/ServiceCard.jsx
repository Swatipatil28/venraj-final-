import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

export default function ServiceCard({ service }) {
  const { t } = useLanguage();


  return (
    <motion.article
      whileHover={{ y: -8 }}
      className="glass-panel surface-hover group overflow-hidden rounded-[28px]"
    >
      <div className="image-mask h-48 sm:h-64">
        <img
          src={service.image || service.imageUrl || "/fallback.jpg"}
          alt={service.title}
          className="h-full w-full object-cover rounded-xl transition duration-500 group-hover:scale-105"
          onError={(e) => { e.target.src = "/fallback.jpg"; }}
        />
      </div>
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
        <div className="space-y-3 sm:space-y-4">
          <span className="pill-chip text-[10px] sm:text-xs capitalize">{service.category}</span>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A]">{service.title}</h3>
            <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-6 sm:leading-7 text-[#475569] line-clamp-3">{service.shortDescription || service.description}</p>
          </div>
        </div>
        <Link to={`/services/${service.id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-[#2E86AB] transition-colors hover:text-[#1B6CA8]">
          {t("common.learnMore")}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </motion.article>
  );
}
