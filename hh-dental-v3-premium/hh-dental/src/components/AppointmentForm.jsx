import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { postAppointment } from "../services/api.service";
import { useLanguage } from "../context/LanguageContext";
import { useToast } from "../context/ToastContext";
import api from "../services/api.service";

const LS_KEY = "userAppointments";
const POLL_INTERVAL = 15000; // 15 seconds

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

// ── localStorage helpers ─────────────────────────────────────────────────────
function saveToStorage(data) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch (_) {}
}
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_) { return null; }
}
function clearStorage() {
  try { localStorage.removeItem(LS_KEY); } catch (_) {}
}

// ── Validation ───────────────────────────────────────────────────────────────
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

// ── Sub-components ───────────────────────────────────────────────────────────
function StepDot({ active, done, index, label }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
        style={{
          background: done || active ? "var(--primary)" : "var(--bg-elevated)",
          color: done || active ? "white" : "var(--muted)",
          border: `1px solid ${done || active ? "var(--primary)" : "var(--line)"}`,
        }}
      >
        {index + 1}
      </div>
      <span className={`hidden text-sm font-medium sm:block ${active ? "text-[var(--text)]" : "text-[var(--muted)]"}`}>{label}</span>
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

// ── Status badge config ──────────────────────────────────────────────────────
const STATUS_STYLES = {
  pending: {
    wrapper: "border-amber-500/30 bg-amber-500/10",
    text: "text-amber-400",
    dotClass: "bg-amber-400 animate-pulse",
    label: "Pending Confirmation",
    message: "Our team will review your request and confirm within 24 hours. This page auto-updates.",
  },
  confirmed: {
    wrapper: "border-emerald-500/30 bg-emerald-500/10",
    text: "text-emerald-400",
    dotClass: "bg-emerald-400",
    label: "Confirmed ✓",
    message: "🎉 Your appointment has been confirmed! We look forward to seeing you.",
  },
  completed: {
    wrapper: "border-blue-500/30 bg-blue-500/10",
    text: "text-blue-400",
    dotClass: "bg-blue-400",
    label: "Completed",
    message: "Thank you for visiting! We hope you had a great experience.",
  },
  cancelled: {
    wrapper: "border-rose-500/30 bg-rose-500/10",
    text: "text-rose-400",
    dotClass: "bg-rose-400",
    label: "Cancelled",
    message: "This appointment has been cancelled.",
  },
};

// ── Appointment details view (shown after booking / on refresh) ──────────────
function AppointmentDetails({ appointment, onBookAnother }) {
  const style = STATUS_STYLES[appointment.status] || STATUS_STYLES.pending;

  return (
    <div className="text-center">
      {/* Checkmark */}
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#2E86AB]/10">
        <svg viewBox="0 0 24 24" className="h-10 w-10 text-[var(--primary)]" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path d="M5 13.2 9 17l10-10" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h3 className="mt-6 text-4xl">Appointment Booked!</h3>

      {/* Live status badge */}
      <motion.div
        key={appointment.status}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`mx-auto mt-6 flex max-w-sm items-center justify-center gap-2 rounded-2xl border px-5 py-3 ${style.wrapper}`}
      >
        <span className={`h-2 w-2 shrink-0 rounded-full ${style.dotClass}`} />
        <span className={`text-sm font-semibold tracking-wide ${style.text}`}>{style.label}</span>
      </motion.div>

      <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-[var(--muted)] font-medium">
        {style.message}
      </p>

      {/* Reference number */}
      {appointment.appointmentRef && (
        <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-5 py-2.5 shadow-sm">
          <span className="text-xs text-[var(--muted)]">Ref:</span>
          <span className="font-mono text-sm font-bold tracking-widest text-[var(--primary)]">
            {appointment.appointmentRef}
          </span>
        </div>
      )}

      {/* Appointment details summary */}
      {(appointment.clinicName || appointment.preferredDate) && (
        <div className="mx-auto mt-6 max-w-sm rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left text-sm text-[var(--muted)] space-y-2 shadow-sm">
          {appointment.patientName && (
            <p><span className="text-[var(--primary)] font-semibold">Patient:</span> {appointment.patientName}</p>
          )}
          {appointment.clinicName && (
            <p><span className="text-[var(--primary)] font-semibold">Clinic:</span> {appointment.clinicName}</p>
          )}
          {appointment.preferredDate && (
            <p>
              <span className="text-[var(--primary)] font-semibold">Preferred Date:</span>{" "}
              {new Date(appointment.preferredDate).toLocaleDateString()}
            </p>
          )}
        </div>
      )}

      {/* Book another */}
      <button onClick={onBookAnother} className="cta-secondary mx-auto mt-8 block">
        Book Another Appointment
      </button>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function AppointmentForm({ clinics = [], services = [] }) {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success
  const [appointment, setAppointment] = useState(null);
  const pollRef = useRef(null);

  // ── Restore from localStorage on mount ───────────────────────────────────
  useEffect(() => {
    const saved = loadFromStorage();
    if (saved?.appointmentRef) {
      setAppointment(saved);
      setStatus("success");
    }
  }, []);

  // ── Poll appointment status every 15s ────────────────────────────────────
  useEffect(() => {
    if (status !== "success" || !appointment?.appointmentRef) return;

    const poll = async () => {
      try {
        const res = await api.get(
          `/appointments/status?ref=${appointment.appointmentRef}`,
          { timeout: 8000 }
        );
        const latest = res?.data?.data ?? res?.data;
        if (latest?.status && latest.status !== appointment.status) {
          const updated = { ...appointment, status: latest.status };
          setAppointment(updated);
          saveToStorage(updated);
          if (latest.status === "confirmed") {
            showToast("Your appointment has been confirmed! 🎉", "success");
          }
        }
      } catch (_) {
        // Silently ignore — don't spam toasts on network errors
      }
    };

    poll(); // immediate check
    pollRef.current = setInterval(poll, POLL_INTERVAL);
    return () => clearInterval(pollRef.current);
  }, [status, appointment?.appointmentRef]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Book another ─────────────────────────────────────────────────────────
  const handleBookAnother = () => {
    clearStorage();
    clearInterval(pollRef.current);
    setAppointment(null);
    setStatus("idle");
    setForm(initialForm);
    setStep(0);
    setErrors({});
  };

  // ── Form handlers ─────────────────────────────────────────────────────────
  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const goNext = () => {
    const nextErrors = validateStep(form, step, t);
    if (Object.keys(nextErrors).length) { setErrors(nextErrors); return; }
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
    if (Object.keys(submitErrors).length) { setErrors(submitErrors); return; }

    setStatus("loading");
    try {
      const result = await postAppointment({
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

      const selectedClinic = clinics.find((c) => c._id === form.clinicId);

      const newAppointment = {
        appointmentRef: result?.appointmentRef || "",
        status: result?.status || "pending",
        patientName: form.patientName,
        phone: form.phone,
        clinicName: selectedClinic?.name || result?.clinic?.name || "",
        preferredDate: form.preferredDate,
        bookedAt: new Date().toISOString(),
      };

      saveToStorage(newAppointment);
      setAppointment(newAppointment);
      showToast(t("common.bookedSuccess"), "success");
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

  // ── Show appointment details if already booked ────────────────────────────
  if (status === "success" && appointment) {
    return <AppointmentDetails appointment={appointment} onBookAnother={handleBookAnother} />;
  }

  // ── Booking form ──────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((item, index) => (
          <StepDot key={item} index={index} active={step === index} done={index < step} label={t(item)} />
        ))}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
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
                  <input className="field-input" name="patientName" value={form.patientName} onChange={handleChange} placeholder={t("booking.fullName")} />
                </InputField>
                <InputField label={t("booking.phone")} error={errors.phone}>
                  <input className="field-input" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" />
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
                    <textarea className="field-input min-h-24 resize-none" name="currentMedications" value={form.currentMedications} onChange={handleChange} />
                  </InputField>
                </div>
                <div className="md:col-span-2">
                  <InputField label={t("booking.medicalHistory")} error={errors.pastMedicalHistory}>
                    <textarea className="field-input min-h-24 resize-none" name="pastMedicalHistory" value={form.pastMedicalHistory} onChange={handleChange} />
                  </InputField>
                </div>
                <div className="md:col-span-2">
                  <InputField label={t("booking.dentalHistory")} error={errors.pastDentalHistory}>
                    <textarea className="field-input min-h-24 resize-none" name="pastDentalHistory" value={form.pastDentalHistory} onChange={handleChange} />
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
                    className="field-input"
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

      <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button 
          type="button" 
          onClick={goPrev} 
          className="cta-secondary w-full sm:w-auto" 
          disabled={step === 0}
        >
          {t("common.previous")}
        </button>
        {step < 2 ? (
          <button 
            type="button" 
            onClick={goNext} 
            className="cta-primary w-full sm:w-auto"
          >
            {t("common.next")}
          </button>
        ) : (
          <button
            type="submit"
            className="cta-primary w-full sm:w-auto"
            disabled={status === "loading" || !form.clinicId || !form.serviceId || !form.preferredDate}
          >
            {status === "loading" ? `${t("common.loading")}...` : t("common.submit")}
          </button>
        )}
      </div>
    </form>
  );
}
