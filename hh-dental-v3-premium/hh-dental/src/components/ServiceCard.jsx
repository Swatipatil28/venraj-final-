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
      <div className="image-mask h-64">
        <img
          src={service.image || service.imageUrl || "/fallback.jpg"}
          alt={service.title}
          className="h-full w-full object-cover rounded-xl transition duration-500 group-hover:scale-105"
          onError={(e) => { e.target.src = "/fallback.jpg"; }}
        />
      </div>
      <div className="space-y-4 p-6">
        <span className="pill-chip capitalize">{service.category}</span>
        <div>
          <h3 className="text-3xl">{service.title}</h3>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{service.shortDescription || service.description}</p>
        </div>
        <Link to={`/services/${service.id}`} className="inline-flex items-center gap-2 text-sm text-[var(--gold-soft)]">
          {t("common.learnMore")}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </motion.article>
  );
}
