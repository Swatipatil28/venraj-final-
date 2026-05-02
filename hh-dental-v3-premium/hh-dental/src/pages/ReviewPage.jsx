import { useState } from "react";
import { submitReview } from "../services/api.service";
import PageHero from "../components/PageHero";

export default function ReviewPage() {
  const [formData, setFormData] = useState({
    appointmentId: "",
    patientName: "",
    rating: 5,
    comment: "",
  });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setError(null);
    try {
      await submitReview(formData);
      setStatus("success");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to submit review");
      setStatus("error");
    }
  };

  return (
    <>
      <PageHero
        image="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1600&q=80"
        eyebrow="Feedback"
        title="Share your experience"
        body="Your feedback helps us maintain our premium standard of care."
      />
      <section className="section-pad">
        <div className="container-shell max-w-2xl">
          {status === "success" ? (
            <div className="glass-panel rounded-[34px] p-8 text-center">
              <h2 className="text-3xl text-[var(--primary)]">Thank You!</h2>
              <p className="mt-4 text-[var(--muted)]">Your review has been successfully submitted.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="glass-panel rounded-[34px] p-6 md:p-8 space-y-6">
              {error && <div className="text-red-400 text-sm">{error}</div>}
              <div>
                <label className="field-label">Appointment ID</label>
                <input
                  required
                  type="text"
                  className="field-input"
                  placeholder="Enter your appointment ID"
                  value={formData.appointmentId}
                  onChange={(e) => setFormData({ ...formData, appointmentId: e.target.value })}
                />
              </div>
              <div>
                <label className="field-label">Patient Name</label>
                <input
                  required
                  type="text"
                  className="field-input"
                  placeholder="Your full name"
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                />
              </div>
              <div>
                <label className="field-label">Rating</label>
                <select
                  required
                  className="field-input"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                >
                  <option value={5}>5 - Excellent</option>
                  <option value={4}>4 - Very Good</option>
                  <option value={3}>3 - Average</option>
                  <option value={2}>2 - Poor</option>
                  <option value={1}>1 - Terrible</option>
                </select>
              </div>
              <div>
                <label className="field-label">Comment</label>
                <textarea
                  rows={4}
                  className="field-input"
                  placeholder="Tell us about your experience..."
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                />
              </div>
              <button
                type="submit"
                disabled={status === "submitting"}
                className="cta-primary w-full mt-4"
              >
                {status === "submitting" ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
