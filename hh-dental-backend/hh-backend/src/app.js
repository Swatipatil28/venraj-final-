const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const { notFound, errorHandler } = require("./middlewares/error.middleware");

// Route files
const clinicRoutes      = require("./routes/clinic.routes");
const doctorRoutes      = require("./routes/doctor.routes");
const serviceRoutes     = require("./routes/service.routes");
const appointmentRoutes = require("./routes/appointment.routes");
const adminRoutes       = require("./routes/admin.routes");

const app = express();

// ── Security ──────────────────────────────────────────────
app.use(helmet());

// ── CORS ──────────────────────────────────────────────────
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ── Rate Limiting ─────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { success: false, message: "Too many requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

const appointmentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { success: false, message: "Too many appointment requests. Please try again in an hour." },
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many login attempts. Please try again later." },
});

app.use(globalLimiter);

// ── Body Parsing ──────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

app.use((req, _res, next) => {
  console.log("Request:", req.method, req.url);
  next();
});

// ── Logging ───────────────────────────────────────────────
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// ── Health Check ──────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "H&H Dental API is running",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// ── Public API Routes ─────────────────────────────────────
app.use("/api/clinics",      clinicRoutes);
app.use("/api/doctors",      doctorRoutes);
app.use("/api/services",     serviceRoutes);
app.use("/api/appointments", appointmentLimiter, appointmentRoutes);

// ── Admin Routes ──────────────────────────────────────────
app.use("/api/admin", adminRoutes);

// ── Error Handling ────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
