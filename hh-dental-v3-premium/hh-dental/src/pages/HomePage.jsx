import { Link } from "react-router-dom";
import { getClinics, getDoctors } from "../services/api.service";
import { useApiResource } from "../hooks/useApiResource";
import { useLanguage } from "../context/LanguageContext";
import HeroSection from "../components/HeroSection";
import Services from "../components/Services";
import BeforeAfter from "../components/BeforeAfter";
import Testimonials from "../components/Testimonials";
import SectionIntro from "../components/SectionIntro";
import DoctorCard from "../components/DoctorCard";
import LocationCard from "../components/LocationCard";
import { CardSkeleton } from "../components/LoadingSkeleton";

export default function HomePage() {
  const { t } = useLanguage();
  const doctors = useApiResource(getDoctors, [], []);
  const clinics = useApiResource(getClinics, [], []);

  return (
    <>
      <HeroSection />
      <Services />
      <BeforeAfter />

      <section className="section-pad">
        <div className="container-shell">
          <SectionIntro
            eyebrow={t("home.sectionDoctors")}
            title="A senior clinical team that makes expertise visible."
            body="Patients convert faster when the specialists feel credible, warm, and easy to understand. These profiles are built to do exactly that."
            action={
              <Link to="/doctors" className="cta-secondary">
                {t("common.viewAll")}
              </Link>
            }
          />

          {doctors.loading ? <CardSkeleton count={3} height="h-[30rem]" /> : null}
          {!doctors.loading ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {doctors.data.slice(0, 3).map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <Testimonials />

      <section className="section-pad">
        <div className="container-shell">
          <SectionIntro
            eyebrow={t("home.sectionLocations")}
            title="Clinics grouped by region for faster booking decisions."
            body="Patients can quickly spot their nearest premium clinic and move directly into the consultation flow."
          />

          {clinics.loading ? <CardSkeleton count={3} /> : null}
          {!clinics.loading ? (
            <div className="grid gap-6 lg:grid-cols-3">
              {clinics.data.slice(0, 3).map((clinic) => (
                <LocationCard key={clinic.id} clinic={clinic} />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className="pb-24">
        <div className="container-shell">
          <div className="glass-panel rounded-[36px] px-6 py-10 text-center md:px-10 md:py-14">
            <p className="eyebrow mb-4">Appointment CTA</p>
            <h2 className="mx-auto max-w-4xl text-4xl md:text-6xl">{t("home.ctaTitle")}</h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[var(--muted)]">{t("home.ctaBody")}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/book-appointment" className="cta-primary">
                {t("common.bookNow")}
              </Link>
              <Link to="/locations" className="cta-secondary">
                {t("nav.locations")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
