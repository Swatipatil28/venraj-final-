const express = require("express");
const router = express.Router();
const { createReview } = require("../controllers/review.controller");

// Public: POST /api/reviews
router.post("/", createReview);

module.exports = router;
