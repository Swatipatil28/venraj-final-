const express = require("express");
const router = express.Router();
const { getClinics, getClinicById } = require("../controllers/clinic.controller");

// GET /api/clinics
router.get("/", getClinics);

// GET /api/clinics/:id
router.get("/:id", getClinicById);

module.exports = router;
