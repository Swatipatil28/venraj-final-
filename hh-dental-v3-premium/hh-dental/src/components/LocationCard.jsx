import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default function LocationCard({ clinic }) {
  const { t } = useLanguage();

  return (
    <article className="glass-panel surface-hover overflow-hidden rounded-[24px] sm:rounded-[28px] flex flex-col justify-between h-full bg-white relative border-t-4 border-t-[#2E86AB]">
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4 sm:mb-5">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#F1F5F9] text-[#2E86AB] shrink-0">
              <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A]">{clinic.area || clinic.name}</h3>
          </div>
          
          {clinic.address && (
            <p className="text-xs sm:text-sm leading-relaxed text-[#475569] mb-4">
              {clinic.address}
            </p>
          )}

          <a href={`tel:${clinic.phone.replace(/\s+/g, "")}`} className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#2E86AB] hover:text-[#1B6CA8] transition-colors">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {clinic.phone}
          </a>
        </div>
      </div>
      <div className="p-6 sm:p-8 pt-4 sm:pt-4 flex flex-col sm:flex-row gap-3 sm:gap-4 mt-auto border-t border-[#E2E8F0]">
        <a href={clinic.mapUrl} target="_blank" rel="noreferrer" className="cta-secondary w-full sm:w-auto text-center justify-center">
          {t("common.directions")}
        </a>
        <Link to="/book-appointment" className="cta-primary w-full sm:w-auto text-center justify-center">
          {t("common.bookNow")}
        </Link>
      </div>
    </article>
  );
}
