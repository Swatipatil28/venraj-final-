import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default function LocationCard({ clinic }) {
  const { t } = useLanguage();


  return (
    <article className="glass-panel surface-hover overflow-hidden rounded-[28px]">
      <div className="image-mask h-56">
        <img
          src={clinic.image || clinic.imageUrl || "/fallback.jpg"}
          alt={clinic.name}
          className="h-full w-full object-cover rounded-xl transition duration-500 hover:scale-105"
          onError={(e) => { e.target.src = "/fallback.jpg"; }}
        />
      </div>
      <div className="space-y-4 p-6">
        <div>
          <p className="eyebrow mb-2">{clinic.city}</p>
          <h3 className="text-3xl">{clinic.name}</h3>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{clinic.address}</p>
          <a href={`tel:${clinic.phone.replace(/\s+/g, "")}`} className="mt-3 block text-sm text-[var(--gold-soft)]">
            {clinic.phone}
          </a>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href={clinic.mapUrl} target="_blank" rel="noreferrer" className="cta-secondary">
            {t("common.directions")}
          </a>
          <Link to="/book-appointment" className="cta-primary">
            {t("common.bookNow")}
          </Link>
        </div>
      </div>
    </article>
  );
}
