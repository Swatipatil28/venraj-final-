const { body } = require("express-validator");

const createAppointmentRules = [
  body("patientName")
    .trim()
    .notEmpty().withMessage("Patient name is required")
    .isLength({ min: 2, max: 100 }).withMessage("Name must be 2–100 characters"),

  body("phone")
    .trim()
    .notEmpty().withMessage("Phone number is required")
    .matches(/^\+?[\d\s\-()+]{8,20}$/).withMessage("Invalid phone number format"),

  body("age")
    .optional()
    .isInt({ min: 1, max: 120 }).withMessage("Age must be between 1 and 120"),

  body("gender")
    .optional({ checkFalsy: true })
    .trim()
    .isIn(["Male", "Female", "Other"]).withMessage("Gender must be Male, Female, or Other"),

  body("symptoms")
    .trim()
    .notEmpty().withMessage("Please describe your concern or symptoms")
    .isLength({ max: 1000 }).withMessage("Symptoms must be under 1000 characters"),

  body("medications")
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage("Medications must be under 500 characters"),

  body("medicalHistory")
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage("Medical history must be under 1000 characters"),

  body("dentalHistory")
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage("Dental history must be under 1000 characters"),

  body("clinicId")
    .notEmpty().withMessage("Please select a clinic")
    .isMongoId().withMessage("Invalid clinic ID"),

  body("doctorId")
    .optional({ nullable: true, checkFalsy: true })
    .isMongoId().withMessage("Invalid doctor ID"),

  body("serviceId")
    .optional({ nullable: true, checkFalsy: true })
    .isMongoId().withMessage("Invalid service ID"),

  body("preferredDate")
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601().withMessage("Invalid date format"),
];

const updateAppointmentRules = [
  body("status")
    .optional()
    .isIn(["pending", "confirmed", "completed", "cancelled", "feedback"])
    .withMessage("Invalid status value"),

  body("notes")
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage("Notes must be under 2000 characters"),

  body("confirmedDate")
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601().withMessage("Invalid date format"),
];

module.exports = { createAppointmentRules, updateAppointmentRules };
