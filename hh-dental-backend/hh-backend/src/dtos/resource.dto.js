const { body } = require("express-validator");

// ── Clinic ────────────────────────────────────────────────
const clinicRules = [
  body("state").trim().notEmpty().withMessage("Branch (State) is required"),
  body("area").trim().notEmpty().withMessage("Area is required"),
  body("phone")
    .trim()
    .notEmpty().withMessage("Phone is required")
    .matches(/^\+?[\d\s\-()+]{8,20}$/).withMessage("Invalid phone number"),
  body("email")
    .optional()
    .isEmail().withMessage("Invalid email address"),
  body("image")
    .optional()
    .trim()
    .custom((value) => !value || /^https?:\/\/.+/i.test(value))
    .withMessage("Image must be a valid URL"),
];

// ── Doctor ────────────────────────────────────────────────
const doctorRules = [
  body("name").trim().notEmpty().withMessage("Doctor name is required"),
  body("specialization").trim().notEmpty().withMessage("Specialization is required"),
  body("experience").trim().notEmpty().withMessage("Experience is required"),
  body("qualifications").trim().notEmpty().withMessage("Qualifications are required"),
  body("bio").optional().trim(),
  body("image")
    .optional()
    .trim()
    .custom((value) => !value || /^https?:\/\/.+/i.test(value))
    .withMessage("Image must be a valid URL"),
  body("clinics")
    .optional()
    .isArray().withMessage("Clinics must be an array")
    .custom((val) => val.every((id) => /^[a-f\d]{24}$/i.test(id)))
    .withMessage("Invalid clinic ID in array"),
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
