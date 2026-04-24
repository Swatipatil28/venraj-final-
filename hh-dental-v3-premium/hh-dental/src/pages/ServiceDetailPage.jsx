import { Link, useParams } from "react-router-dom";
import { getServices } from "../services/api.service";
import { useApiResource } from "../hooks/useApiResource";
import { useLanguage } from "../context/LanguageContext";
import SectionIntro from "../components/SectionIntro";
import ServiceCard from "../components/ServiceCard";
import { CardSkeleton, PanelSkeleton } from "../components/LoadingSkeleton";

export default function ServiceDetailPage() {
  const { id } = useParams();
  const { t } = useLanguage();
  const { data, loading } = useApiResource(getServices, [], []);

  const service = data.find((item) => item.id === id);
  let related = data.filter((item) => item.id !== id && item.category === service?.category).slice(0, 3);
  if (related.length === 0 && data.length > 0) {
    related = data.filter((item) => item.id !== id).slice(0, 3);
  }

  if (loading) {
    return (
      <div className="container-shell py-28">
        <PanelSkeleton />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="container-shell py-28 text-center">
        <h1 className="text-4xl">Service not found.</h1>
        <Link to="/services" className="cta-primary mt-6 inline-flex">
          {t("nav.services")}
        </Link>
      </div>
    );
  }

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={service.image || service.imageUrl || "/fallback.jpg"}
            alt={service.title}
            className="h-[72vh] min-h-[520px] w-full object-cover"
            onError={(e) => { e.target.src = "/fallback.jpg"; }}
          />
          <div className="hero-overlay absolute inset-0" />
        </div>
        <div className="container-shell relative flex min-h-[72vh] items-end py-16">
          <div className="max-w-3xl pb-6">
            <p className="eyebrow mb-4 capitalize">{service.category}</p>
            <h1 className="luxury-title">{service.title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">{service.description}</p>
            <Link to="/book-appointment" className="cta-primary mt-8 inline-flex">
              {t("common.bookNow")}
            </Link>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-shell grid gap-12 lg:grid-cols-[0.52fr_0.48fr]">
          <div>
            <SectionIntro eyebrow={t("services.benefits")} title="Why patients choose this treatment." />
            <div className="space-y-4">
              {service.benefits.map((benefit) => (
                <div key={benefit} className="glass-panel rounded-[24px] p-5 text-sm leading-7 text-[var(--muted)]">
                  {benefit}
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionIntro eyebrow={t("services.process")} title="A polished, step-by-step treatment journey." />
            <div className="space-y-4">
              {service.process.map((item, index) => (
                <div key={item} className="glass-panel rounded-[24px] p-5">
                  <p className="eyebrow mb-2">Step {index + 1}</p>
                  <p className="text-base leading-7 text-[var(--muted)]">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-shell">
          <div className="glass-panel mb-14 rounded-[32px] p-8 text-center">
            <p className="eyebrow mb-4">{t("services.inlineCta")}</p>
            <h2 className="text-4xl md:text-5xl">Private consultation. Clear next steps. Fast booking.</h2>
            <Link to="/book-appointment" className="cta-primary mt-7 inline-flex">
              {t("common.bookNow")}
            </Link>
          </div>

          <SectionIntro eyebrow={t("services.related")} title="You may also like" />
          {!related.length ? <CardSkeleton count={3} /> : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {related.map((item) => (
                <ServiceCard key={item.id} service={item} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
