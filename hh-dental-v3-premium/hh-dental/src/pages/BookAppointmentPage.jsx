import { getClinics, getServices } from "../services/api.service";
import { useApiResource } from "../hooks/useApiResource";
import { useLanguage } from "../context/LanguageContext";
import PageHero from "../components/PageHero";
import AppointmentForm from "../components/AppointmentForm";
import { PanelSkeleton } from "../components/LoadingSkeleton";

export default function BookAppointmentPage() {
  const { t } = useLanguage();
  const clinics = useApiResource(getClinics, [], []);
  const services = useApiResource(getServices, [], []);

  const isLoading = clinics.loading || services.loading;

  return (
    <>
      <PageHero
        image="https://images.unsplash.com/photo-1631217868264-e6b90bb7e133?auto=format&fit=crop&w=1600&q=80"
        eyebrow={t("nav.book")}
        title={t("booking.title")}
        body={t("booking.body")}
        chips={["3-step booking", "Medical details", "Fast callback", "Premium clinics"]}
      />

      <section className="pb-24">
        <div className="container-shell grid gap-8 lg:grid-cols-[0.36fr_0.64fr]">
          <aside className="glass-panel h-fit rounded-[32px] p-7">
            <p className="eyebrow mb-4">Why Patients Convert</p>
            <div className="space-y-5">
              {[
                "A guided stepper prevents the form from feeling crowded.",
                "Medical history fields help the clinic respond with the right doctor and preparation advice.",
                "Location and service selection are placed last, right before confirmation.",
              ].map((item) => (
                <div key={item} className="rounded-[24px] border border-[rgba(240,214,156,0.1)] bg-[rgba(255,255,255,0.03)] p-4 text-sm leading-7 text-[var(--muted)]">
                  {item}
                </div>
              ))}
            </div>
          </aside>

          <div className="glass-panel rounded-[34px] p-6 md:p-8">
            {isLoading ? <PanelSkeleton height="h-[38rem]" /> : null}
            {!isLoading ? <AppointmentForm clinics={clinics.data} services={services.data} /> : null}
          </div>
        </div>
      </section>
    </>
  );
}
