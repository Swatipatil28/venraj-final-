import { Link } from "react-router-dom";
import { getServices } from "../services/api.service";
import { useRealtimeResource } from "../hooks/useRealtimeResource";
import { useLanguage } from "../context/LanguageContext";
import ServiceCard from "./ServiceCard";
import SectionIntro from "./SectionIntro";
import { CardSkeleton } from "./LoadingSkeleton";

export default function Services() {
  const { t } = useLanguage();
  const { data, loading } = useRealtimeResource(getServices, {
    eventName: "serviceUpdated",
    initialData: [],
  });
  const featured = Array.isArray(data) ? data.slice(0, 6) : [];

  return (
    <section className="section-pad">
      <div className="container-shell">
        <SectionIntro
          eyebrow={t("home.sectionServices")}
          title="High-impact treatments planned for healthy, beautiful results."
          body="From implant rehabilitation to clear aligners and smile makeovers, every treatment is designed to feel bespoke rather than routine."
          action={
            <Link to="/services" className="cta-secondary">
              {t("common.viewAll")}
            </Link>
          }
        />

        {loading ? <CardSkeleton count={3} /> : null}
        {!loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featured.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
