import { useMemo, useState } from "react";
import { getDoctors } from "../services/api.service";
import { useApiResource } from "../hooks/useApiResource";
import { useLanguage } from "../context/LanguageContext";
import PageHero from "../components/PageHero";
import SectionIntro from "../components/SectionIntro";
import DoctorCard from "../components/DoctorCard";
import { CardSkeleton } from "../components/LoadingSkeleton";

export default function DoctorsPage() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState(t("doctors.all"));
  const { data, loading } = useApiResource(getDoctors, [], [t]);

  const specializations = useMemo(
    () => [t("doctors.all"), ...new Set(data.map((item) => item.specialization))],
    [data, t]
  );
  const filtered = filter === t("doctors.all") ? data : data.filter((doctor) => doctor.specialization === filter);

  return (
    <>
      <PageHero
        image="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1600&q=80"
        eyebrow={t("nav.doctors")}
        title={t("doctors.title")}
        body={t("doctors.body")}
        chips={["Prosthodontics", "Implantology", "Orthodontics", "Facial aesthetics"]}
      />

      <section className="section-pad">
        <div className="container-shell">
          <SectionIntro eyebrow={t("doctors.filter")} title="Filter by specialization." />

          <div className="mb-10 flex flex-wrap gap-3">
            {specializations.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className="rounded-full border border-[rgba(240,214,156,0.14)] px-4 py-2 text-sm text-[var(--muted)] transition hover:border-[rgba(240,214,156,0.3)] hover:text-white"
                style={filter === item ? { background: "linear-gradient(135deg, var(--secondary), var(--primary))", color: "#130f0a" } : {}}
              >
                {item}
              </button>
            ))}
          </div>

          {loading ? <CardSkeleton count={6} height="h-[32rem]" /> : null}
          {!loading ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
