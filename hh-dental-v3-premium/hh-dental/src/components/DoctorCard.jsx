import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

export default function DoctorCard({ doctor }) {
  const { t } = useLanguage();


  return (
    <motion.article whileHover={{ y: -6 }} className="glass-panel surface-hover overflow-hidden rounded-[24px] sm:rounded-[28px] h-full flex flex-col">
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex-1">
          <p className="eyebrow mb-1 sm:mb-2 text-[#2E86AB] text-[10px] sm:text-xs">
            {Array.isArray(doctor.specialization) ? doctor.specialization.join(", ") : doctor.specialization}
          </p>
          <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A]">{doctor.name}</h3>
          <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-6 sm:leading-7 text-[#475569]">{doctor.bio}</p>
        </div>
        <div className="grid gap-2 sm:gap-3 text-[11px] sm:text-sm text-[#475569] mt-6 pt-5 sm:pt-6 border-t border-[#E2E8F0]">
          <p>
            <span className="text-[#0F172A] font-semibold">{t("doctors.experience")}:</span> {doctor.experience}
          </p>
          <p>
            <span className="text-[#0F172A] font-semibold">{t("doctors.clinics")}:</span> {doctor.clinics.join(", ")}
          </p>
          <p>{doctor.qualifications}</p>
        </div>
      </div>
    </motion.article>
  );
}
