import { useMemo, useState } from "react";
import { getServices } from "../services/api.service";
import { useApiResource } from "../hooks/useApiResource";
import { useLanguage } from "../context/LanguageContext";
import PageHero from "../components/PageHero";
import SectionIntro from "../components/SectionIntro";
import ServiceCard from "../components/ServiceCard";
import { CardSkeleton } from "../components/LoadingSkeleton";

export default function ServicesPage() {
  const { t } = useLanguage();
  const [tab, setTab] = useState("dental");
  const { data, loading } = useApiResource(getServices, [], []);

  const filtered = useMemo(() => data.filter((item) => item.category === tab), [data, tab]);

  return (
    <>
      <PageHero
        image="https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=1600&q=80"
        eyebrow={t("nav.services")}
        title={t("services.title")}
        body={t("services.body")}
        chips={["Digital diagnostics", "Luxury comfort", "Smile design", "Aesthetic detailing"]}
      />

      <section className="section-pad">
        <div className="container-shell">
          <SectionIntro
            eyebrow="Tabs"
            title="Choose the service category that matches the outcome you want."
            body="The tabs keep comparison fast while preserving a polished, editorial feel."
          />

          <div className="mb-10 inline-flex rounded-full border border-[rgba(240,214,156,0.14)] bg-[rgba(255,255,255,0.035)] p-1">
            {[
              { id: "dental", label: t("services.dentalTab") },
              { id: "aesthetic", label: t("services.aestheticTab") },
            ].map((item) => {
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  className={`rounded-full px-5 py-2.5 text-sm transition ${
                    active ? "bg-[linear-gradient(135deg,var(--secondary),var(--primary))] text-[#130f0a]" : "text-[var(--muted)]"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {loading ? <CardSkeleton count={6} /> : null}
          {!loading ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
