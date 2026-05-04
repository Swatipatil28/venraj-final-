const Clinic = require("../models/Clinic");
const { sendSuccess, sendError } = require("../utils/response");
const { emitEvent } = require("../utils/socket");

// Helper to broadcast full clinics list
const broadcastClinics = async () => {
  const clinics = await Clinic.find({ isActive: true }).sort({ state: 1, name: 1 });
  emitEvent("locationUpdated", clinics);
};

// GET /api/clinics
const getClinics = async (req, res, next) => {
  try {
    const { name, state } = req.query;
    const filter = { isActive: true };
    if (name) filter.name = new RegExp(name, "i");
    if (state) filter.state = state;

    const clinics = await Clinic.find(filter).sort({ state: 1, name: 1 });
    return sendSuccess(res, clinics, "Clinics retrieved");
  } catch (err) {
    next(err);
  }
};

// GET /api/clinics/:id
const getClinicById = async (req, res, next) => {
  try {
    const clinic = await Clinic.findById(req.params.id);
    if (!clinic) return sendError(res, "Clinic not found", 404);
    return sendSuccess(res, clinic);
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/clinics
const createClinic = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    const clinic = await Clinic.create(payload);
    await broadcastClinics();
    return sendSuccess(res, clinic, "Clinic created successfully", 201);
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/clinics/:id
const updateClinic = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    const clinic = await Clinic.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true, runValidators: true }
    );
    if (!clinic) return sendError(res, "Clinic not found", 404);
    await broadcastClinics();
    return sendSuccess(res, clinic, "Clinic updated successfully");
  } catch (err) {
    next(err);
  }
};

// DELETE /api/admin/clinics/:id
const deleteClinic = async (req, res, next) => {
  try {
    const clinic = await Clinic.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!clinic) return sendError(res, "Clinic not found", 404);
    await broadcastClinics();
    return sendSuccess(res, null, "Clinic deactivated successfully");
  } catch (err) {
    next(err);
  }
};

module.exports = { getClinics, getClinicById, createClinic, updateClinic, deleteClinic };
