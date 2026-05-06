// Backend Server - H&H Dental (V2)
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");

const { notFound, errorHandler } = require("./middlewares/error.middleware");
const { getAllowedOrigins, isAllowedOrigin } = require("./utils/socket");

// Route files
const clinicRoutes      = require("./routes/clinic.routes");
const doctorRoutes      = require("./routes/doctor.routes");
const serviceRoutes     = require("./routes/service.routes");
const appointmentRoutes = require("./routes/appointment.routes");
const testimonialRoutes = require("./routes/testimonial.routes");
const reviewRoutes      = require("./routes/review.routes");
const adminRoutes       = require("./routes/admin.routes");

const app = express();

// ── Security ──────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// ── CORS ──────────────────────────────────────────────────
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (process.env.NODE_ENV === "development") {
      return callback(null, true);
    }

    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

// ── Rate Limiting ─────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: process.env.NODE_ENV === "development" ? 1000 : 100,
  message: { success: false, message: "Too many requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

const appointmentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50,
  message: { success: false, message: "Too many appointment requests. Please try again in an hour." },
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { success: false, message: "Too many login attempts. Please try again later." },
});

app.use(globalLimiter);

// ── Body Parsing ──────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// ── Static Files ──────────────────────────────────────────
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

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

app.get("/", (req, res) => {
  res.send("H&H Dental API is running...");
});

// ── Public API Routes ─────────────────────────────────────
app.use("/api/clinics",      clinicRoutes);
app.use("/api/doctors",      doctorRoutes);
app.use("/api/services",     serviceRoutes);
app.use("/api/appointments", (req, res, next) => {
  if (req.method === "POST" && req.path === "/") {
    return appointmentLimiter(req, res, next);
  }
  next();
}, appointmentRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/reviews",      reviewRoutes);

// ── Admin Routes ──────────────────────────────────────────
app.use("/api/admin", adminRoutes);

// ── Root Route ────────────────────────────────────────────
app.get("/", (req, res) => {
  res.send("H&H Dental API is running...");
});

// ── Error Handling ────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
