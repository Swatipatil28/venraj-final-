import { useMemo, useState } from "react";
import { getDoctors } from "../services/api.service";
import socket from "../utils/socket";
import { useApiResource } from "../hooks/useApiResource";
import { useLanguage } from "../context/LanguageContext";
import PageHero from "../components/PageHero";
import SectionIntro from "../components/SectionIntro";
import DoctorCard from "../components/DoctorCard";
import { CardSkeleton } from "../components/LoadingSkeleton";

export default function DoctorsPage() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState(t("doctors.all"));
  const [stateFilter, setStateFilter] = useState("All");
  const { data, loading, setData } = useApiResource(getDoctors, [], [t]);

  useEffect(() => {
    socket.on("doctorUpdated", (updatedData) => {
      setData(updatedData);
    });

    return () => {
      socket.off("doctorUpdated");
    };
  }, [setData]);

  const specializations = useMemo(() => {
    const allSpecs = data.flatMap((item) => 
      Array.isArray(item.specialization) ? item.specialization : [item.specialization]
    );
    return [t("doctors.all"), ...new Set(allSpecs)];
  }, [data, t]);

  const filtered = data.filter((doctor) => {
    const specs = Array.isArray(doctor.specialization) ? doctor.specialization : [doctor.specialization];
    const matchesSpec = filter === t("doctors.all") || specs.includes(filter);
    const matchesState = stateFilter === "All" || doctor.state === stateFilter;
    return matchesSpec && matchesState;
  });

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
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <SectionIntro eyebrow={t("doctors.filter")} title="Find your specialist." className="mb-0" />
            
            <div className="flex flex-col gap-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--primary)]">Select Branch</p>
              <div className="flex flex-wrap gap-2">
                {["All", "Telangana", "Andhra Pradesh"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStateFilter(s)}
                    className={`rounded-xl border px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all ${
                      stateFilter === s 
                      ? "bg-[var(--primary)] border-[var(--primary)] text-[#130f0a] shadow-primary-sm" 
                      : "border-slate-100 bg-white text-[#64748B] hover:border-[var(--primary)]/30"
                    }`}
                  >
                    {s === "All" ? "All Regions" : s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#94A3B8] mb-4">Filter by specialization</p>
            <div className="flex flex-wrap gap-3">
              {specializations.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className={`rounded-full border px-5 py-2.5 text-xs font-semibold transition-all ${
                    filter === item
                    ? "bg-[#0F172A] border-[#0F172A] text-white"
                    : "border-slate-100 bg-white text-[#64748B] hover:border-slate-200"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {loading ? <CardSkeleton count={6} height="h-[32rem]" /> : null}
          {!loading ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((doctor, idx) => (
                <DoctorCard key={doctor._id || doctor.id || idx} doctor={doctor} />
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
