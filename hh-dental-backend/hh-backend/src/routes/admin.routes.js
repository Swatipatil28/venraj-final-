const express = require("express");

const { protect } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const upload = require("../middlewares/upload.middleware");

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
  uploadServiceImage,
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

const { loginRules, clinicRules, doctorRules, serviceRules } = require("../dtos/resource.dto");
const { updateAppointmentRules } = require("../dtos/appointment.dto");

const router = express.Router();

router.post("/login", loginRules, validate, login);
router.get("/me", protect, getMe);

router.get("/appointments/stats", protect, getAppointmentStats);
router.get("/appointments", protect, getAppointments);
router.get("/appointments/:id", protect, getAppointmentById);
router.get("/appointments/:id/whatsapp", protect, getWhatsAppLinks);
router.put("/appointments/:id", protect, updateAppointmentRules, validate, updateAppointment);
router.put("/appointments/:id/confirm", protect, confirmAppointment);
router.patch("/appointments/:id", protect, updateAppointmentRules, validate, updateAppointment);
router.delete("/appointments/:id", protect, deleteAppointment);

router.get("/clinics", protect, getClinics);
router.post("/clinics", protect, clinicRules, validate, createClinic);
router.put("/clinics/:id", protect, clinicRules, validate, updateClinic);
router.delete("/clinics/:id", protect, deleteClinic);

router.get("/doctors", protect, getDoctors);
router.post("/doctors", protect, doctorRules, validate, createDoctor);
router.put("/doctors/:id", protect, doctorRules, validate, updateDoctor);
router.delete("/doctors/:id", protect, deleteDoctor);

router.get("/services", protect, getServices);
router.post("/services/upload", protect, upload.single("image"), uploadServiceImage);
router.post("/services", protect, serviceRules, validate, createService);
router.put("/services/:id", protect, serviceRules, validate, updateService);
router.delete("/services/:id", protect, deleteService);

router.get("/testimonials", protect, getAllTestimonials);
router.post("/testimonials", protect, createTestimonial);
router.put("/testimonials/:id", protect, updateTestimonial);
router.delete("/testimonials/:id", protect, deleteTestimonial);

router.get("/reviews", protect, getReviews);
router.patch("/reviews/:id/approve", protect, approveReview);

module.exports = router;
