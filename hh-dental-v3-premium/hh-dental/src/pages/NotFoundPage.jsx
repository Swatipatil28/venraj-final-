import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default function NotFoundPage() {
  const { t } = useLanguage();

  return (
    <div className="container-shell flex min-h-[70vh] flex-col items-center justify-center text-center">
      <p className="eyebrow mb-4">404</p>
      <h1 className="text-5xl md:text-7xl">This page stepped out of the treatment plan.</h1>
      <p className="mt-5 max-w-xl text-base leading-8 text-[var(--muted)]">
        Head back to the homepage or jump straight into booking.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link to="/" className="cta-secondary">
          {t("common.backToHome")}
        </Link>
        <Link to="/book-appointment" className="cta-primary">
          {t("common.bookNow")}
        </Link>
      </div>
    </div>
  );
}
