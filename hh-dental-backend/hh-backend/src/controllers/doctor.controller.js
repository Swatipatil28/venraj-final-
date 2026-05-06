const Doctor = require("../models/Doctor");
const { sendSuccess, sendError } = require("../utils/response");
const { emitEvent } = require("../utils/socket");

const shapeDoctor = (doctor) => ({
  _id: doctor._id,
  id: doctor._id,
  name: doctor.name,
  specialization: Array.isArray(doctor.specialization) ? doctor.specialization : [],
  qualifications: doctor.qualifications,
  bio: doctor.bio,
  state: doctor.state,
  clinics: Array.isArray(doctor.clinics) ? doctor.clinics : [],
});

const broadcastDoctors = async () => {
  const doctors = await Doctor.find({ isActive: true }).sort({ name: 1 });
  emitEvent("doctorUpdated", doctors.map(shapeDoctor));
};

// GET /api/doctors
const getDoctors = async (req, res, next) => {
  try {
    const { specialization, state } = req.query;
    const filter = { isActive: true };
    if (specialization) filter.specialization = new RegExp(specialization, "i");
    if (state) filter.state = state;

    const doctors = await Doctor.find(filter).sort({ name: 1 });

    return sendSuccess(res, doctors.map(shapeDoctor), "Doctors retrieved");
  } catch (err) {
    next(err);
  }
};

// GET /api/doctors/:id
const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return sendError(res, "Doctor not found", 404);
    return sendSuccess(res, shapeDoctor(doctor));
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/doctors
const createDoctor = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    const doctor = await Doctor.create(payload);
    await broadcastDoctors();
    return sendSuccess(res, shapeDoctor(doctor), "Doctor created successfully", 201);
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/doctors/:id
const updateDoctor = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true, runValidators: true }
    );
    if (!doctor) return sendError(res, "Doctor not found", 404);
    await broadcastDoctors();
    return sendSuccess(res, shapeDoctor(doctor), "Doctor updated successfully");
  } catch (err) {
    next(err);
  }
};

// DELETE /api/admin/doctors/:id
const deleteDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!doctor) return sendError(res, "Doctor not found", 404);
    await broadcastDoctors();
    return sendSuccess(res, null, "Doctor deactivated successfully");
  } catch (err) {
    next(err);
  }
};

module.exports = { getDoctors, getDoctorById, createDoctor, updateDoctor, deleteDoctor };
