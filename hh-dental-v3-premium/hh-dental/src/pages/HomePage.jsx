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
              {doctors.data.slice(0, 3).map((doctor, idx) => (
                <DoctorCard key={doctor._id || doctor.id || idx} doctor={doctor} />
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
              {clinics.data.slice(0, 3).map((clinic, idx) => (
                <LocationCard key={clinic._id || clinic.id || idx} clinic={clinic} />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className="pb-32">
        <div className="container-shell">
          <div className="relative overflow-hidden rounded-[48px] bg-[#0F172A] px-6 py-20 text-center md:px-20 md:py-24 shadow-primary-lg">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--primary)_0%,_transparent_70%)]" />
            </div>
            <div className="relative z-10">
              <p className="mb-6 inline-block rounded-full bg-[var(--primary)]/20 px-6 py-2 text-sm font-bold uppercase tracking-[0.2em] text-[var(--primary)] border border-[var(--primary)]/30">
                Ready to transform your smile?
              </p>
              <h2 className="mx-auto max-w-4xl text-4xl font-black text-white md:text-7xl leading-[1.1]">
                {t("home.ctaTitle")}
              </h2>
              <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-slate-400 font-medium">
                {t("home.ctaBody")}
              </p>
              <div className="mt-12 flex flex-wrap justify-center gap-6">
                <Link to="/book-appointment" className="cta-primary px-10 py-5 text-lg shadow-primary-md hover:shadow-primary-lg transform hover:-translate-y-1">
                  {t("common.bookNow")}
                </Link>
                <Link to="/locations" className="rounded-xl border-2 border-white/20 bg-white/5 px-10 py-5 text-lg font-bold text-white transition-all hover:bg-white/10 hover:border-white/40 backdrop-blur-md">
                  {t("nav.locations")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
