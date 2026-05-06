import { getClinics } from "../services/api.service";
import { useRealtimeResource } from "../hooks/useRealtimeResource";
import { useLanguage } from "../context/LanguageContext";
import PageHero from "../components/PageHero";
import SectionIntro from "../components/SectionIntro";
import LocationCard from "../components/LocationCard";
import { CardSkeleton } from "../components/LoadingSkeleton";

export default function LocationsPage() {
  const { t } = useLanguage();
  const { data, loading } = useRealtimeResource(getClinics, {
    eventName: "locationUpdated",
    initialData: [],
  });

  const regions = [
    { key: "Telangana", title: t("locations.telangana") },
    { key: "Andhra Pradesh", title: t("locations.andhra") },
  ];

  return (
    <>
      <PageHero
        image="https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&w=1600&q=80"
        eyebrow={t("nav.locations")}
        title={t("locations.title")}
        body={t("locations.body")}
        chips={["Hyderabad", "Tirupati", "Vijayawada", "Guntur"]}
      />

      <section className="section-pad">
        <div className="container-shell space-y-16">
          {loading ? <CardSkeleton count={4} /> : null}
          {!loading
            ? regions.map((region) => {
                const clinics = (Array.isArray(data) ? data : []).filter((clinic) => clinic?.state === region.key);
                if (!clinics.length) return null;

                return (
                  <div key={region.key}>
                    <SectionIntro eyebrow={region.title} title={`${region.title} clinics`} />
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                      {clinics.map((clinic, idx) => (
                        <LocationCard key={clinic._id || clinic.id || idx} clinic={clinic} />
                      ))}
                    </div>
                  </div>
                );
              })
            : null}
        </div>
      </section>
    </>
  );
}
