import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { postAppointment } from "../services/api.service";
import { useLanguage } from "../context/LanguageContext";
import { useToast } from "../context/ToastContext";

const steps = ["booking.step1", "booking.step2", "booking.step3"];

const initialForm = {
  patientName: "",
  phone: "",
  age: "",
  gender: "",
  issue: "",
  currentMedications: "",
  pastMedicalHistory: "",
  pastDentalHistory: "",
  clinicId: "",
  serviceId: "",
  preferredDate: "",
};

function validateStep(form, step, t) {
  const errors = {};
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (step === 0) {
    if (!form.patientName.trim()) errors.patientName = t("errors.required");
    if (!form.phone.trim()) errors.phone = t("errors.required");
    else if (!/^\+?[\d\s()-]{8,15}$/.test(form.phone.trim())) errors.phone = t("errors.phone");
  }

  if (step === 1) {
    if (!form.age.trim()) errors.age = t("errors.required");
    else if (Number.isNaN(Number(form.age)) || Number(form.age) < 1 || Number(form.age) > 120) errors.age = t("errors.age");
    if (!form.gender) errors.gender = t("errors.required");
    if (!form.issue.trim()) errors.issue = t("errors.required");
    if (!form.currentMedications.trim()) errors.currentMedications = t("errors.required");
    if (!form.pastMedicalHistory.trim()) errors.pastMedicalHistory = t("errors.required");
    if (!form.pastDentalHistory.trim()) errors.pastDentalHistory = t("errors.required");
  }

  if (step === 2) {
    if (!form.clinicId) errors.clinicId = t("errors.required");
    if (!form.serviceId) errors.serviceId = t("errors.required");
    if (!form.preferredDate) errors.preferredDate = t("errors.required");
    else {
      const selected = new Date(form.preferredDate);
      if (selected < today) errors.preferredDate = t("errors.date");
    }
  }

  return errors;
}

function StepDot({ active, done, index, label }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
        style={{
          background: done || active ? "linear-gradient(135deg, var(--gold-soft), var(--gold))" : "rgba(255,255,255,0.06)",
          color: done || active ? "#130f0a" : "var(--muted)",
          border: `1px solid ${done || active ? "transparent" : "rgba(240,214,156,0.14)"}`,
        }}
      >
        {index + 1}
      </div>
      <span className={`text-sm ${active ? "text-white" : "text-[var(--muted)]"}`}>{label}</span>
    </div>
  );
}

function InputField({ label, error, children }) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      {children}
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  );
}

export default function AppointmentForm({ clinics = [], services = [] }) {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [successMessage, setSuccessMessage] = useState(t("booking.successBody"));

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const goNext = () => {
    const nextErrors = validateStep(form, step, t);
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const goPrev = () => {
    setErrors({});
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const submitErrors = validateStep(form, 2, t);
    if (Object.keys(submitErrors).length) {
      setErrors(submitErrors);
      return;
    }

    setStatus("loading");

    try {
      await postAppointment({
        patientName: form.patientName,
        phone: form.phone,
        age: Number(form.age),
        gender: form.gender,
        symptoms: form.issue,
        medications: form.currentMedications,
        medicalHistory: form.pastMedicalHistory,
        dentalHistory: form.pastDentalHistory,
        clinicId: form.clinicId,
        serviceId: form.serviceId,
        preferredDate: form.preferredDate,
      });
      showToast(t("common.bookedSuccess"), "success");
      setSuccessMessage(t("booking.successBody"));
      setStatus("success");
      setForm(initialForm);
      setStep(0);
      setErrors({});
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Booking failed. Please try again.";
      console.error("[AppointmentForm] Booking error:", err?.response?.data || err);
      showToast(msg, "error");
      setStatus("idle");
    }
  };

  if (status === "success") {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[rgba(216,180,106,0.14)]">
          <svg viewBox="0 0 24 24" className="h-10 w-10 text-[var(--gold-soft)]" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="M5 13.2 9 17l10-10" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="mt-6 text-4xl">{t("booking.successTitle")}</h3>
        <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-[var(--muted)]">{successMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((item, index) => (
          <StepDot key={item} index={index} active={step === index} done={index < step} label={t(item)} />
        ))}
      </div>

      <div className="rounded-[28px] border border-[rgba(240,214,156,0.1)] bg-[rgba(255,255,255,0.03)] p-6 md:p-7">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="grid gap-5 md:grid-cols-2"
          >
            {step === 0 ? (
              <>
                <InputField label={t("booking.fullName")} error={errors.patientName}>
                  <input
                    className="field-input"
                    name="patientName"
                    value={form.patientName}
                    onChange={handleChange}
                    placeholder={t("booking.fullName")}
                  />
                </InputField>
                <InputField label={t("booking.phone")} error={errors.phone}>
                  <input
                    className="field-input"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                  />
                </InputField>
              </>
            ) : null}

            {step === 1 ? (
              <>
                <InputField label={t("booking.age")} error={errors.age}>
                  <input className="field-input" name="age" value={form.age} onChange={handleChange} placeholder="28" />
                </InputField>
                <InputField label={t("booking.gender")} error={errors.gender}>
                  <select className="field-input bg-[var(--bg-elevated)]" name="gender" value={form.gender} onChange={handleChange}>
                    <option value="">{t("common.choose")}</option>
                    <option value="Male">{t("booking.male")}</option>
                    <option value="Female">{t("booking.female")}</option>
                    <option value="Other">{t("booking.other")}</option>
                  </select>
                </InputField>
                <div className="md:col-span-2">
                  <InputField label={t("booking.symptoms")} error={errors.issue}>
                    <textarea className="field-input min-h-28 resize-none" name="issue" value={form.issue} onChange={handleChange} />
                  </InputField>
                </div>
                <div className="md:col-span-2">
                  <InputField label={t("booking.medications")} error={errors.currentMedications}>
                    <textarea
                      className="field-input min-h-24 resize-none"
                      name="currentMedications"
                      value={form.currentMedications}
                      onChange={handleChange}
                    />
                  </InputField>
                </div>
                <div className="md:col-span-2">
                  <InputField label={t("booking.medicalHistory")} error={errors.pastMedicalHistory}>
                    <textarea
                      className="field-input min-h-24 resize-none"
                      name="pastMedicalHistory"
                      value={form.pastMedicalHistory}
                      onChange={handleChange}
                    />
                  </InputField>
                </div>
                <div className="md:col-span-2">
                  <InputField label={t("booking.dentalHistory")} error={errors.pastDentalHistory}>
                    <textarea
                      className="field-input min-h-24 resize-none"
                      name="pastDentalHistory"
                      value={form.pastDentalHistory}
                      onChange={handleChange}
                    />
                  </InputField>
                </div>
              </>
            ) : null}

            {step === 2 ? (
              <>
                <InputField label={t("booking.location")} error={errors.clinicId}>
                  <select className="field-input bg-[var(--bg-elevated)]" name="clinicId" value={form.clinicId} onChange={handleChange}>
                    <option value="">{t("common.choose")}</option>
                    {clinics.map((clinic) => (
                      <option key={clinic._id} value={clinic._id}>
                        {clinic.name} — {clinic.city}
                      </option>
                    ))}
                  </select>
                </InputField>
                <InputField label={t("booking.service")} error={errors.serviceId}>
                  <select className="field-input bg-[var(--bg-elevated)]" name="serviceId" value={form.serviceId} onChange={handleChange}>
                    <option value="">{t("common.choose")}</option>
                    {services.map((service) => (
                      <option key={service._id} value={service._id}>
                        {service.title}
                      </option>
                    ))}
                  </select>
                </InputField>
                <InputField label={t("booking.date")} error={errors.preferredDate}>
                  <input
                    type="date"
                    className="field-input [color-scheme:dark]"
                    name="preferredDate"
                    value={form.preferredDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </InputField>
              </>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <button type="button" onClick={goPrev} className="cta-secondary" disabled={step === 0}>
          {t("common.previous")}
        </button>

        {step < 2 ? (
          <button type="button" onClick={goNext} className="cta-primary">
            {t("common.next")}
          </button>
        ) : (
          <button
            type="submit"
            className="cta-primary"
            disabled={
              status === "loading" ||
              !form.clinicId ||
              !form.serviceId ||
              !form.preferredDate
            }
          >
            {status === "loading" ? `${t("common.loading")}...` : t("common.submit")}
          </button>
        )}
      </div>
    </form>
  );
}
