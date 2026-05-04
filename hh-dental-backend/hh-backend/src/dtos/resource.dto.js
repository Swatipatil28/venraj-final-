const { body } = require("express-validator");

// ── Clinic ────────────────────────────────────────────────
const clinicRules = [
  body("name").trim().notEmpty().withMessage("Clinic name is required"),
  body("phone")
    .trim()
    .notEmpty().withMessage("Phone is required"),
  body("state")
    .trim()
    .notEmpty().withMessage("State is required")
    .isIn(["Telangana", "Andhra Pradesh"]).withMessage("Invalid state"),
];

// ── Doctor ────────────────────────────────────────────────
const doctorRules = [
  body("name").trim().notEmpty().withMessage("Doctor name is required"),
  body("specialization")
    .custom((val) => Array.isArray(val) && val.length > 0)
    .withMessage("At least one specialization is required"),
  body("qualifications").trim().notEmpty().withMessage("Qualifications are required"),
  body("bio").optional().trim(),
  body("state")
    .trim()
    .notEmpty().withMessage("State is required")
    .isIn(["Telangana", "Andhra Pradesh"]).withMessage("Invalid state"),
];

// ── Service ───────────────────────────────────────────────
const serviceRules = [
  body("title").trim().notEmpty().withMessage("Service title is required"),
  body("category")
    .notEmpty().withMessage("Category is required")
    .isIn(["dental", "aesthetic"]).withMessage("Category must be dental or aesthetic"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("benefits").optional().isArray(),
  body("process").optional().isArray(),
  body("icon").optional().trim(),
  body("image")
    .optional()
    .trim()
    .custom((value) => !value || /^https?:\/\/.+/i.test(value))
    .withMessage("Image must be a valid URL"),
];

// ── Admin Login ───────────────────────────────────────────
const loginRules = [
  body("email").trim().isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

module.exports = { clinicRules, doctorRules, serviceRules, loginRules };
