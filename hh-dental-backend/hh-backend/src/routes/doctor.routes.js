const express = require("express");
const router = express.Router();
const { getDoctors, getDoctorById } = require("../controllers/doctor.controller");

// GET /api/doctors
router.get("/", getDoctors);

// GET /api/doctors/:id
router.get("/:id", getDoctorById);

module.exports = router;
