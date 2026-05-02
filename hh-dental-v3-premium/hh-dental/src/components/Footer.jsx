import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-[#1E293B] bg-[#0F172A]">
      <div className="container-shell grid gap-10 px-10 py-[60px] md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="space-y-5">
          <p className="eyebrow text-[#2E86AB]">H&H Dental</p>
          <h2 className="text-3xl font-semibold text-white">Luxury care that feels reassuring from the first click.</h2>
          <p className="max-w-md text-sm leading-7 text-[#CBD5F5]">
            Premium dentistry, aesthetic planning, and concierge-style booking across Telangana and Andhra Pradesh.
          </p>
        </div>

        <div className="space-y-5">
          <p className="eyebrow text-[#2E86AB]">Explore</p>
          <div className="space-y-4 text-sm text-[#CBD5F5]">
            <Link to="/services" className="block transition-colors duration-200 hover:text-[#2E86AB]">
              {t("nav.services")}
            </Link>
            <Link to="/doctors" className="block transition-colors duration-200 hover:text-[#2E86AB]">
              {t("nav.doctors")}
            </Link>
            <Link to="/locations" className="block transition-colors duration-200 hover:text-[#2E86AB]">
              {t("nav.locations")}
            </Link>
            <Link to="/book-appointment" className="block transition-colors duration-200 hover:text-[#2E86AB]">
              {t("nav.book")}
            </Link>
          </div>
        </div>

        <div className="space-y-5">
          <p className="eyebrow text-[#2E86AB]">Contact</p>
          <div className="space-y-4 text-sm text-[#CBD5F5]">
            <a href="tel:+919703334624" className="block transition-colors duration-200 hover:text-[#2E86AB]">
              +91 97033 34624
            </a>
            <a href="mailto:care@hhdental.com" className="block transition-colors duration-200 hover:text-[#2E86AB]">
              care@hhdental.com
            </a>
            <p className="pt-2">Open daily for consultations and treatment planning.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
