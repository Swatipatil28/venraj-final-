const Clinic = require("../models/Clinic");
const { sendSuccess, sendError } = require("../utils/response");

// GET /api/clinics
const getClinics = async (req, res, next) => {
  try {
    const { state, city } = req.query;
    const filter = { isActive: true };
    if (state) filter.state = new RegExp(state, "i");
    if (city) filter.city = new RegExp(city, "i");

    const clinics = await Clinic.find(filter).sort({ state: 1, city: 1 });
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
    const image = req.body.image || req.body.imageUrl;
    if (image) payload.image = image;
    const clinic = await Clinic.create(payload);
    return sendSuccess(res, clinic, "Clinic created successfully", 201);
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/clinics/:id
const updateClinic = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    const image = req.body.image || req.body.imageUrl;
    if (image) {
      payload.image = image;
    } else {
      delete payload.image;
      delete payload.imageUrl;
    }
    const clinic = await Clinic.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true, runValidators: true }
    );
    if (!clinic) return sendError(res, "Clinic not found", 404);
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
    return sendSuccess(res, null, "Clinic deactivated successfully");
  } catch (err) {
    next(err);
  }
};

module.exports = { getClinics, getClinicById, createClinic, updateClinic, deleteClinic };
