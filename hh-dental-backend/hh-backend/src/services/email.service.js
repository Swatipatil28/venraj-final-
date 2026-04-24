const nodemailer = require("nodemailer");

const placeholderValues = new Set([
  "",
  "your_email@gmail.com",
  "your_app_password",
  "YOUR_EMAIL@gmail.com",
  "YOUR_APP_PASSWORD",
]);

let mailDisabledReason = null;

const hasValidEmailConfig = () => {
  const user = (process.env.SMTP_USER || "").trim();
  const pass = (process.env.SMTP_PASS || "").trim();

  if (!user || !pass) {
    return false;
  }

  if (placeholderValues.has(user) || placeholderValues.has(pass)) {
    return false;
  }

  return true;
};

const isEmailEnabled = () => {
  if ((process.env.EMAIL_ENABLED || "").toLowerCase() === "false") {
    return false;
  }

  return hasValidEmailConfig();
};

const disableEmail = (reason) => {
  if (!mailDisabledReason) {
    mailDisabledReason = reason;
    console.warn(`Email disabled: ${reason}`);
  }
};

const createTransporter = () => {
  if (!isEmailEnabled()) {
    disableEmail("SMTP credentials are missing or still using placeholder values.");
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number.parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const safeSendMail = async (message) => {
  if (mailDisabledReason) {
    return;
  }

  const transporter = createTransporter();
  if (!transporter) {
    return;
  }

  try {
    await transporter.sendMail(message);
  } catch (error) {
    disableEmail(error.message);
  }
};

const sendAppointmentConfirmation = async (appointment, clinic) => {
  if (!appointment?.email) {
    return;
  }

  const date = appointment.preferredDate
    ? new Date(appointment.preferredDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "To be confirmed";

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 20px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #1C1C1E 0%, #0F0F0F 100%); padding: 32px 40px; text-align: center; }
        .header h1 { color: #D4AF37; font-size: 24px; margin: 0 0 4px; letter-spacing: 0.1em; }
        .header p { color: rgba(245,240,232,0.6); font-size: 13px; margin: 0; }
        .body { padding: 36px 40px; }
        .greeting { font-size: 16px; color: #1a1a1a; margin-bottom: 20px; }
        .detail-box { background: #f9f7f3; border-left: 4px solid #D4AF37; border-radius: 4px; padding: 20px 24px; margin: 24px 0; }
        .detail-row { display: flex; margin-bottom: 10px; font-size: 14px; }
        .detail-row:last-child { margin-bottom: 0; }
        .detail-label { color: #888; width: 140px; flex-shrink: 0; font-weight: 500; }
        .detail-value { color: #1a1a1a; }
        .status-badge { display: inline-block; background: #FFF3CD; color: #856404; border: 1px solid #FFEAA0; padding: 4px 14px; border-radius: 100px; font-size: 12px; font-weight: 600; letter-spacing: 0.05em; }
        .note { background: #EFF8FF; border: 1px solid #BFE3FD; border-radius: 6px; padding: 16px 20px; margin: 20px 0; font-size: 13px; color: #1a6da0; line-height: 1.6; }
        .footer { background: #f9f9f9; padding: 24px 40px; text-align: center; font-size: 12px; color: #aaa; border-top: 1px solid #eee; }
        .phone { color: #D4AF37; font-weight: 600; font-size: 16px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>H&H Dental Services</h1>
          <p>Appointment Request Received</p>
        </div>
        <div class="body">
          <p class="greeting">Dear <strong>${appointment.patientName}</strong>,</p>
          <p style="color:#555;font-size:14px;line-height:1.7;">
            Thank you for choosing H&H Dental Services. We have received your appointment request and our team will contact you within 24 hours to confirm your visit.
          </p>
          <div class="detail-box">
            <div class="detail-row">
              <span class="detail-label">Reference No.</span>
              <span class="detail-value"><strong>${appointment.appointmentRef}</strong></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Clinic</span>
              <span class="detail-value">${clinic?.name || "H&H Dental"} — ${clinic?.city || ""}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Preferred Date</span>
              <span class="detail-value">${date}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Your Concern</span>
              <span class="detail-value">${appointment.symptoms}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Status</span>
              <span class="detail-value"><span class="status-badge">${appointment.status}</span></span>
            </div>
          </div>
          <div class="note">
            📞 For immediate assistance, please call us at <span class="phone">+91 98765 11001</span>
            <br/>🕐 Our team is available Monday-Sunday, 9 AM - 8 PM.
          </div>
          <p style="color:#555;font-size:13px;line-height:1.7;">
            We look forward to serving you with the finest dental and aesthetic care.
          </p>
          <p style="color:#555;font-size:13px;">Warm regards,<br/><strong style="color:#1a1a1a;">H&H Dental Services Team</strong></p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} H&H Dental Services · All Rights Reserved</p>
          <p style="margin:4px 0;">Kondapur · Manikonda · Tirupati · Vijayawada · Guntur · and more</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await safeSendMail({
    from: process.env.EMAIL_FROM || "H&H Dental <noreply@hhdental.in>",
    to: appointment.email,
    subject: `Appointment Request Received — Ref: ${appointment.appointmentRef}`,
    html,
  });
};

const sendStatusUpdateEmail = async (appointment) => {
  const statusMessages = {
    Confirmed: {
      subject: "Your appointment is CONFIRMED",
      color: "#0d6e3c",
      bg: "#d4edda",
      msg: "Great news! Your appointment has been confirmed. Please arrive 10 minutes before your scheduled time.",
    },
    Cancelled: {
      subject: "Appointment Cancelled",
      color: "#721c24",
      bg: "#f8d7da",
      msg: "Your appointment has been cancelled. Please contact us to reschedule at a convenient time.",
    },
    Completed: {
      subject: "Thank you for visiting H&H Dental",
      color: "#004085",
      bg: "#cce5ff",
      msg: "We hope your visit was a great experience! Please share your feedback and we'd love to see you again.",
    },
  };

  const info = statusMessages[appointment?.status];
  if (!info || !appointment?.email) {
    return;
  }

  await safeSendMail({
    from: process.env.EMAIL_FROM || "H&H Dental <noreply@hhdental.in>",
    to: appointment.email,
    subject: info.subject,
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;">
      <h2 style="color:#D4AF37;">H&H Dental Services</h2>
      <div style="background:${info.bg};border-radius:8px;padding:20px;margin:16px 0;">
        <p style="color:${info.color};font-weight:600;font-size:16px;">Status: ${appointment.status}</p>
        <p style="color:#333;">${info.msg}</p>
        ${appointment.notes ? `<p style="color:#555;font-size:13px;"><strong>Note from clinic:</strong> ${appointment.notes}</p>` : ""}
      </div>
      <p style="font-size:13px;color:#666;">Reference: <strong>${appointment.appointmentRef}</strong></p>
      <p style="font-size:13px;color:#666;">📞 +91 98765 11001</p>
    </div>`,
  });
};

module.exports = { sendAppointmentConfirmation, sendStatusUpdateEmail };
