const express = require("express");
const router = express.Router();
const { getServices, getServiceById } = require("../controllers/service.controller");

// GET /api/services
router.get("/", getServices);

// GET /api/services/:id
router.get("/:id", getServiceById);

module.exports = router;
