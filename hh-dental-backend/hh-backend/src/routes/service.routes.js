const express = require("express");
const router = express.Router();
const { getServices, getServiceById, uploadServiceImage } = require("../controllers/service.controller");
const upload = require("../middlewares/upload.middleware");

// GET /api/services
router.get("/", getServices);

// GET /api/services/:id
router.get("/:id", getServiceById);

// POST /api/services/upload - General upload endpoint
router.post("/upload", upload.single("image"), uploadServiceImage);

module.exports = router;
