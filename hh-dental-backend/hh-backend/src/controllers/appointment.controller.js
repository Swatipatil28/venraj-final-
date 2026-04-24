const Appointment = require("../models/Appointment");
const Clinic = require("../models/Clinic");
const { sendSuccess, sendError, sendPaginated } = require("../utils/response");
const { sendAppointmentConfirmation, sendStatusUpdateEmail } = require("../services/email.service");
const { generateWhatsAppLink, generatePatientWhatsAppLink } = require("../utils/whatsapp");
const { PAGINATION, APPOINTMENT_STATUS } = require("../config/constants");

// ─────────────────────────────────────────────────────────
// PUBLIC
// ─────────────────────────────────────────────────────────

// POST /api/appointments
const createAppointment = async (req, res, next) => {
  try {
    const {
      patientName,
      phone,
      age,
      gender,
      symptoms,
      medications,
      medicalHistory,
      dentalHistory,
      clinicId,
      doctorId,
      serviceId,
      preferredDate,
    } = req.body;

    // Verify clinic exists
    const clinic = await Clinic.findById(clinicId);
    if (!clinic) return sendError(res, "Selected clinic not found", 404);

    const appointment = await Appointment.create({
      patientName,
      phone,
      age,
      gender: gender || "",
      symptoms,
      medications,
      medicalHistory,
      dentalHistory: dentalHistory || "",
      clinicId,
      doctorId: doctorId || null,
      serviceId: serviceId || null,
      preferredDate: preferredDate || null,
      status: APPOINTMENT_STATUS.PENDING,
    });

    // Populate references for response
    await appointment.populate([
      { path: "clinicId", select: "name city address phone" },
      { path: "doctorId", select: "name specialization" },
      { path: "serviceId", select: "title category" },
    ]);

    // Send confirmation email (non-blocking)
    sendAppointmentConfirmation(appointment, clinic).catch((err) =>
      console.warn("Email send failed:", err.message)
    );

    return sendSuccess(
      res,
      {
        appointmentRef: appointment.appointmentRef,
        status: appointment.status,
        clinic: appointment.clinicId,
        preferredDate: appointment.preferredDate,
      },
      "Appointment request submitted successfully. Our team will contact you within 24 hours.",
      201
    );
  } catch (err) {
    console.error("[Appointment] createAppointment error:", err.message, err.stack);
    next(err);
  }
};

// ─────────────────────────────────────────────────────────
// ADMIN
// ─────────────────────────────────────────────────────────

// GET /api/admin/appointments
const getAppointments = async (req, res, next) => {
  try {
    const {
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
      status,
      clinicId,
      doctorId,
      date,
      dateFrom,
      dateTo,
      search,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(parseInt(limit), PAGINATION.MAX_LIMIT);
    const skip = (pageNum - 1) * limitNum;

    // ── Build filter ──────────────────────────────────
    const filter = {};

    if (status) filter.status = status;
    if (clinicId) filter.clinicId = clinicId;
    if (doctorId) filter.doctorId = doctorId;

    // Exact date filter
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      filter.preferredDate = { $gte: start, $lte: end };
    }

    // Date range filter
    if (dateFrom || dateTo) {
      filter.preferredDate = {};
      if (dateFrom) filter.preferredDate.$gte = new Date(dateFrom);
      if (dateTo) {
        const end = new Date(dateTo);
        end.setHours(23, 59, 59, 999);
        filter.preferredDate.$lte = end;
      }
    }

    // Search by name or phone or ref
    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [
        { patientName: regex },
        { phone: regex },
        { appointmentRef: regex },
      ];
    }

    // ── Query ────────────────────────────────────────
    const [appointments, total] = await Promise.all([
      Appointment.find(filter)
        .populate("clinicId", "name city")
        .populate("doctorId", "name specialization")
        .populate("serviceId", "title category")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Appointment.countDocuments(filter),
    ]);

    return sendPaginated(res, appointments, total, pageNum, limitNum, "Appointments retrieved");
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/appointments/:id
const getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("clinicId", "name city address phone email")
      .populate("doctorId", "name specialization qualifications")
      .populate("serviceId", "title category description");

    if (!appointment) return sendError(res, "Appointment not found", 404);

    // Generate WhatsApp links
    const whatsappClinic = generateWhatsAppLink(appointment, appointment.clinicId);
    const whatsappPatient = generatePatientWhatsAppLink(
      appointment.phone,
      appointment.patientName
    );

    return sendSuccess(res, {
      ...appointment.toObject(),
      whatsappLinks: {
        clinic: whatsappClinic,
        patient: whatsappPatient,
      },
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/appointments/:id
const updateAppointment = async (req, res, next) => {
  try {
    const { status, notes, confirmedDate, doctorId } = req.body;

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return sendError(res, "Appointment not found", 404);

    const prevStatus = appointment.status;

    if (status) appointment.status = status;
    if (notes !== undefined) appointment.notes = notes;
    if (confirmedDate) appointment.confirmedDate = new Date(confirmedDate);
    if (doctorId) appointment.doctorId = doctorId;

    await appointment.save();

    await appointment.populate([
      { path: "clinicId", select: "name city" },
      { path: "doctorId", select: "name specialization" },
      { path: "serviceId", select: "title" },
    ]);

    // Email on status change
    if (status && status !== prevStatus) {
      sendStatusUpdateEmail(appointment, appointment.clinicId).catch((err) =>
        console.warn("Status email failed:", err.message)
      );
    }

    return sendSuccess(res, appointment, "Appointment updated successfully");
  } catch (err) {
    next(err);
  }
};

// DELETE /api/admin/appointments/:id
const deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) return sendError(res, "Appointment not found", 404);
    return sendSuccess(res, null, "Appointment deleted successfully");
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/appointments/stats
const getAppointmentStats = async (req, res, next) => {
  try {
    const [statusCounts, recentCount, todayCount] = await Promise.all([
      Appointment.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      Appointment.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      }),
      Appointment.countDocuments({
        createdAt: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      }),
    ]);

    const stats = {
      total: 0,
      today: todayCount,
      last7Days: recentCount,
      byStatus: {},
    };

    statusCounts.forEach(({ _id, count }) => {
      stats.byStatus[_id] = count;
      stats.total += count;
    });

    return sendSuccess(res, stats, "Stats retrieved");
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/appointments/:id/whatsapp
const getWhatsAppLinks = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("clinicId", "name city");
    if (!appointment) return sendError(res, "Appointment not found", 404);

    return sendSuccess(res, {
      clinic: generateWhatsAppLink(appointment, appointment.clinicId),
      patient: generatePatientWhatsAppLink(appointment.phone, appointment.patientName),
    }, "WhatsApp links generated");
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  getAppointmentStats,
  getWhatsAppLinks,
};
