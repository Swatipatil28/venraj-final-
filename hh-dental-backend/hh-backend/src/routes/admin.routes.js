const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");

// Controllers
const { login, getMe } = require("../controllers/auth.controller");
const {
  getAppointments,
  getAppointmentById,
  updateAppointment,
  confirmAppointment,
  deleteAppointment,
  getAppointmentStats,
  getWhatsAppLinks,
} = require("../controllers/appointment.controller");
const {
  createClinic,
  updateClinic,
  deleteClinic,
  getClinics,
} = require("../controllers/clinic.controller");
const {
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctors,
} = require("../controllers/doctor.controller");
const {
  createService,
  updateService,
  deleteService,
  getServices,
} = require("../controllers/service.controller");
const {
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require("../controllers/testimonial.controller");
const {
  getReviews,
  approveReview,
} = require("../controllers/review.controller");

// DTOs
const { loginRules } = require("../dtos/resource.dto");
const { clinicRules, doctorRules, serviceRules } = require("../dtos/resource.dto");
const { updateAppointmentRules } = require("../dtos/appointment.dto");

// ── AUTH ──────────────────────────────────────────────────
router.post("/login", loginRules, validate, login);
router.get("/me", protect, getMe);

// ── APPOINTMENTS ──────────────────────────────────────────
router.get("/appointments/stats", protect, getAppointmentStats);
router.get("/appointments", protect, getAppointments);
router.get("/appointments/:id", protect, getAppointmentById);
router.get("/appointments/:id/whatsapp", protect, getWhatsAppLinks);
router.put("/appointments/:id", protect, updateAppointmentRules, validate, updateAppointment);
router.put("/appointments/:id/confirm", protect, confirmAppointment);
router.patch("/appointments/:id", protect, updateAppointmentRules, validate, updateAppointment);
router.delete("/appointments/:id", protect, deleteAppointment);

// ── CLINICS ───────────────────────────────────────────────
router.get("/clinics", protect, getClinics);
router.post("/clinics", protect, clinicRules, validate, createClinic);
router.put("/clinics/:id", protect, clinicRules, validate, updateClinic);
router.delete("/clinics/:id", protect, deleteClinic);

// ── DOCTORS ───────────────────────────────────────────────
router.get("/doctors", protect, getDoctors);
router.post("/doctors", protect, doctorRules, validate, createDoctor);
router.put("/doctors/:id", protect, doctorRules, validate, updateDoctor);
router.delete("/doctors/:id", protect, deleteDoctor);

// ── SERVICES ─────────────────────────────────────────────
router.get("/services", protect, getServices);
router.post("/services", protect, serviceRules, validate, createService);
router.put("/services/:id", protect, serviceRules, validate, updateService);
router.delete("/services/:id", protect, deleteService);

// ── TESTIMONIALS ─────────────────────────────────────────
router.get("/testimonials", protect, getAllTestimonials);
router.post("/testimonials", protect, createTestimonial);
router.put("/testimonials/:id", protect, updateTestimonial);
router.delete("/testimonials/:id", protect, deleteTestimonial);

// ── REVIEWS ─────────────────────────────────────────────
router.get("/reviews", protect, getReviews);
router.patch("/reviews/:id/approve", protect, approveReview);

// ── UPLOADS ─────────────────────────────────────────────
const upload = require("../middlewares/upload.middleware");
router.post("/upload", protect, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Please upload a file" });
  }
  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.status(200).json({
    success: true,
    data: {
      url: fileUrl,
      filename: req.file.filename,
    },
  });
});

module.exports = router;
