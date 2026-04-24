import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

export default function DoctorCard({ doctor }) {
  const { t } = useLanguage();


  return (
    <motion.article whileHover={{ y: -6 }} className="glass-panel surface-hover overflow-hidden rounded-[28px]">
      <div className="image-mask h-80">
        <img
          src={doctor.image || doctor.imageUrl || "/fallback.jpg"}
          alt={doctor.name}
          className="h-full w-full object-cover rounded-xl transition duration-500 hover:scale-105"
          onError={(e) => { e.target.src = "/fallback.jpg"; }}
        />
      </div>
      <div className="space-y-4 p-6">
        <div>
          <p className="eyebrow mb-2">{doctor.specialization}</p>
          <h3 className="text-3xl">{doctor.name}</h3>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{doctor.bio}</p>
        </div>
        <div className="grid gap-3 text-sm text-[var(--muted)]">
          <p>
            <span className="text-[var(--gold-soft)]">{t("doctors.experience")}:</span> {doctor.experience}
          </p>
          <p>
            <span className="text-[var(--gold-soft)]">{t("doctors.clinics")}:</span> {doctor.clinics.join(", ")}
          </p>
          <p>{doctor.qualifications}</p>
        </div>
      </div>
    </motion.article>
  );
}
