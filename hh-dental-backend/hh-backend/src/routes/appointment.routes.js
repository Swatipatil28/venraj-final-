const express = require("express");
const router = express.Router();
const { createAppointment, getAppointments, getAppointmentStatus } = require("../controllers/appointment.controller");
const { createAppointmentRules } = require("../dtos/appointment.dto");
const { protect } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");

// GET /api/appointments/status?ref=...
router.get("/status", getAppointmentStatus);

// GET /api/appointments
router.get("/", protect, getAppointments);

// POST /api/appointments
router.post("/", createAppointmentRules, validate, createAppointment);

module.exports = router;
