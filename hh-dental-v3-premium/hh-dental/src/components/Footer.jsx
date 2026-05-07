import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

import logo from "../assets/logo.png";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#0F172A] pt-24 pb-12 text-white">
      <div className="container-shell">
        <div className="grid gap-12 lg:grid-cols-4 lg:gap-8">
          <div className="col-span-1 lg:col-span-2 space-y-8">
            <Link to="/" className="flex items-center gap-4 group">
              <div className="relative h-16 w-16 sm:h-20 sm:w-20 transition-transform duration-300 group-hover:scale-105">
                <img src={logo} alt="H&H Dental Icon" className="h-full w-full object-contain" />
              </div>
              <div className="flex flex-col border-l border-white/10 pl-4">
                <h2 className="font-['Cinzel'] font-black text-2xl tracking-tighter text-white leading-none">
                  H&H <span className="text-[var(--primary)]">DENTAL</span>
                </h2>
                <p className="mt-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Excellence in every smile
                </p>
              </div>
            </Link>
            <p className="max-w-md text-lg leading-relaxed text-slate-400 font-medium">
              Redefining dental excellence with luxury care, state-of-the-art technology, and a patient-first philosophy across Telangana and Andhra Pradesh.
            </p>
            <div className="flex gap-4">
              {/* Social Icons Placeholder */}
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[var(--primary)] hover:border-[var(--primary)] transition-all cursor-pointer">
                  <div className="h-4 w-4 bg-white/50 rounded-sm" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--primary)]">Quick Links</h4>
            <nav className="flex flex-col gap-4 text-slate-400 font-semibold">
              <Link to="/services" className="hover:text-white transition-colors">{t("nav.services")}</Link>
              <Link to="/doctors" className="hover:text-white transition-colors">{t("nav.doctors")}</Link>
              <Link to="/locations" className="hover:text-white transition-colors">{t("nav.locations")}</Link>
              <Link to="/book-appointment" className="hover:text-white transition-colors">{t("nav.book")}</Link>
            </nav>
          </div>

          <div className="space-y-8">
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--primary)]">Contact Info</h4>
            <div className="space-y-6 text-slate-400 font-semibold">
              <a href="tel:+919030058351" className="flex items-center gap-3 hover:text-white transition-colors">
                <svg className="h-5 w-5 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-sm font-medium text-slate-400">+91 90300 58351</span>
              </a>
              <a href="mailto:care@hhdental.com" className="flex items-center gap-3 hover:text-white transition-colors">
                <span className="text-[var(--primary)]">E:</span> care@hhdental.com
              </a>
              <p className="text-sm leading-relaxed text-slate-500 font-medium italic">
                Available daily for consultations and treatment planning.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-24 border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-slate-500 font-medium">
            © {new Date().getFullYear()} H&H Dental Clinics. All rights reserved.
          </p>
          <div className="flex gap-8 text-xs font-bold uppercase tracking-widest text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
