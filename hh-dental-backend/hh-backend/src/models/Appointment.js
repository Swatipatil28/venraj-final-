const mongoose = require("mongoose");
const { APPOINTMENT_STATUS } = require("../config/constants");

const appointmentSchema = new mongoose.Schema(
  {
    // ── Patient Details ─────────────────────────────────
    patientName: {
      type: String,
      required: [true, "Patient name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^\+?[\d\s\-()+]{8,20}$/, "Invalid phone number format"],
    },
    age: {
      type: Number,
      min: [1, "Age must be at least 1"],
      max: [120, "Age must be realistic"],
    },
    gender: {
      type: String,
      enum: {
        values: ["Male", "Female", "Other", ""],
        message: "Gender must be Male, Female, or Other",
      },
      default: "",
    },

    // ── Medical Details ─────────────────────────────────
    symptoms: {
      type: String,
      required: [true, "Symptoms / concern is required"],
      trim: true,
    },
    medications: {
      type: String,
      default: "",
      trim: true,
    },
    medicalHistory: {
      type: String,
      default: "",
      trim: true,
    },
    dentalHistory: {
      type: String,
      default: "",
      trim: true,
    },

    // ── Booking Details ─────────────────────────────────
    clinicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinic",
      required: [true, "Clinic selection is required"],
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      default: null,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      default: null,
    },
    preferredDate: {
      type: Date,
      default: null,
    },

    // ── Status & Admin ──────────────────────────────────
    status: {
      type: String,
      enum: Object.values(APPOINTMENT_STATUS),
      default: APPOINTMENT_STATUS.PENDING,
    },
    confirmedDate: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },

    // ── Meta ────────────────────────────────────────────
    appointmentRef: {
      type: String,
    },
  },
  { timestamps: true }
);

// Auto-generate appointment reference before save
appointmentSchema.pre("save", function (next) {
  if (!this.appointmentRef) {
    const ts = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).substring(2, 5).toUpperCase();
    this.appointmentRef = `HH-${ts}-${rand}`;
  }
  next();
});

// Indexes for common queries
appointmentSchema.index({ status: 1, createdAt: -1 });
appointmentSchema.index({ clinicId: 1, status: 1 });
appointmentSchema.index({ preferredDate: 1 });
appointmentSchema.index({ phone: 1 });
appointmentSchema.index({ appointmentRef: 1 }, { unique: true });
module.exports = mongoose.model("Appointment", appointmentSchema);
