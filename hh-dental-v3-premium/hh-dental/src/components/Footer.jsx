import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-[rgba(240,214,156,0.1)] bg-[rgba(9,8,13,0.75)]">
      <div className="container-shell grid gap-10 py-12 md:grid-cols-[1.2fr_1fr_1fr]">
        <div className="space-y-4">
          <p className="eyebrow">H&H Dental</p>
          <h2 className="text-3xl">Luxury care that feels reassuring from the first click.</h2>
          <p className="max-w-md text-sm leading-7 text-[var(--muted)]">
            Premium dentistry, aesthetic planning, and concierge-style booking across Telangana and Andhra Pradesh.
          </p>
        </div>

        <div className="space-y-4">
          <p className="eyebrow">Explore</p>
          <div className="space-y-3 text-sm text-[var(--muted)]">
            <Link to="/services" className="block hover:text-white">
              {t("nav.services")}
            </Link>
            <Link to="/doctors" className="block hover:text-white">
              {t("nav.doctors")}
            </Link>
            <Link to="/locations" className="block hover:text-white">
              {t("nav.locations")}
            </Link>
            <Link to="/book-appointment" className="block hover:text-white">
              {t("nav.book")}
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <p className="eyebrow">Contact</p>
          <div className="space-y-3 text-sm text-[var(--muted)]">
            <a href="tel:+919876511001" className="block hover:text-white">
              +91 98765 11001
            </a>
            <a href="mailto:care@hhdental.com" className="block hover:text-white">
              care@hhdental.com
            </a>
            <p>Open daily for consultations and treatment planning.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
