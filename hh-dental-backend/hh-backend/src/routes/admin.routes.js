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

module.exports = router;
