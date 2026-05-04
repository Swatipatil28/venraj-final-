import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

export default function DoctorCard({ doctor }) {
  const specializations = Array.isArray(doctor.specialization) 
    ? doctor.specialization 
    : (doctor.specialization ? doctor.specialization.split("&").map(s => s.trim()) : []);

  return (
    <motion.article 
      whileHover={{ y: -5 }} 
      className="glass-panel group flex flex-col overflow-hidden rounded-[24px] border border-slate-100 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-primary-md"
    >
      <div className="mb-6">
        <h3 className="text-2xl font-black text-[#0F172A] leading-tight mb-2 group-hover:text-[var(--primary)] transition-colors">
          {doctor.name}
        </h3>
        <p className="text-sm font-bold text-[var(--primary)] uppercase tracking-widest mb-4">
          Maxillofacial Prosthodontics and Implantology
        </p>
      </div>

      <div className="mt-auto">
        <div className="flex flex-wrap gap-2">
          {specializations.map((spec, idx) => (
            <span key={idx} className="rounded-full bg-[var(--primary)]/10 px-3 py-1 text-xs font-semibold text-[var(--primary)]">
              {spec}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}
