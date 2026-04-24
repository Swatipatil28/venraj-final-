/**
 * Generate a pre-filled WhatsApp message link for an appointment.
 */
const generateWhatsAppLink = (appointment, clinic) => {
  const number = process.env.WHATSAPP_NUMBER || "919876511001";

  const date = appointment.preferredDate
    ? new Date(appointment.preferredDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "To be confirmed";

  const message = [
    `🦷 *H&H Dental Services — Appointment Confirmation*`,
    ``,
    `📋 Ref: *${appointment.appointmentRef}*`,
    `👤 Patient: *${appointment.patientName}*`,
    `📞 Phone: ${appointment.phone}`,
    `🏥 Clinic: ${clinic?.name || "H&H Dental"}`,
    `📍 Location: ${clinic?.city || ""}`,
    `📅 Preferred Date: ${date}`,
    `💬 Concern: ${appointment.symptoms}`,
    `📊 Status: *${appointment.status}*`,
    ``,
    `We will confirm your appointment time shortly.`,
    `_H&H Dental Services Team_`,
  ].join("\n");

  const encoded = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${encoded}`;
};

/**
 * Generate a WhatsApp link to contact a patient directly.
 */
const generatePatientWhatsAppLink = (phone, patientName) => {
  const cleaned = phone.replace(/\D/g, "");
  const number = cleaned.startsWith("91") ? cleaned : `91${cleaned}`;
  const message = encodeURIComponent(
    `Hello ${patientName}, this is H&H Dental Services. We'd like to confirm your appointment. Please let us know your availability. Thank you! 🦷`
  );
  return `https://wa.me/${number}?text=${message}`;
};

module.exports = { generateWhatsAppLink, generatePatientWhatsAppLink };
