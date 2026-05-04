import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default function LocationCard({ clinic }) {
  return (
    <article className="glass-panel group overflow-hidden rounded-[24px] border border-slate-100 bg-white p-6 sm:p-8 shadow-sm transition-all duration-300 hover:shadow-primary-md hover:border-[var(--primary)]/20 flex flex-col justify-between">
      <div className="mb-6">
        <h3 className="text-2xl font-black text-[#0F172A] leading-tight group-hover:text-[var(--primary)] transition-colors">
          {clinic.name}
        </h3>
      </div>

      <div>
        {clinic.phone && (
          <a href={`tel:${clinic.phone.replace(/\s+/g, "")}`} className="flex items-center gap-3 text-lg font-bold text-[var(--primary)] hover:text-[var(--primary-dark)] transition-colors">
            <svg className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {clinic.phone}
          </a>
        )}
      </div>
    </article>
  );
}
