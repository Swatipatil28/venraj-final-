const express = require("express");
const router = express.Router();
const { getTestimonials } = require("../controllers/testimonial.controller");

// Public: GET /api/testimonials
router.get("/", getTestimonials);

module.exports = router;
