const Doctor = require("../models/Doctor");
const { sendSuccess, sendError } = require("../utils/response");

// GET /api/doctors
const getDoctors = async (req, res, next) => {
  try {
    const { specialization, clinicId } = req.query;
    const filter = { isActive: true };
    if (specialization) filter.specialization = new RegExp(specialization, "i");
    if (clinicId) filter.clinics = clinicId;

    const doctors = await Doctor.find(filter)
      .populate("clinics", "name city state")
      .sort({ name: 1 });

    // Shape response to match frontend DTO (clinics as name strings)
    const shaped = doctors.map((d) => ({
      id: d._id,
      name: d.name,
      specialization: d.specialization,
      experience: d.experience,
      qualifications: d.qualifications,
      bio: d.bio,
      image: d.image || d.imageUrl || "",
      clinics: d.clinics.map((c) => c.name),
    }));

    return sendSuccess(res, shaped, "Doctors retrieved");
  } catch (err) {
    next(err);
  }
};

// GET /api/doctors/:id
const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate("clinics", "name city state address phone");
    if (!doctor) return sendError(res, "Doctor not found", 404);
    return sendSuccess(res, doctor);
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/doctors
const createDoctor = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    const image = req.body.image || req.body.imageUrl;
    if (image) payload.image = image;
    const doctor = await Doctor.create(payload);
    await doctor.populate("clinics", "name city");
    return sendSuccess(res, doctor, "Doctor created successfully", 201);
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/doctors/:id
const updateDoctor = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    const image = req.body.image || req.body.imageUrl;
    if (image) {
      payload.image = image;
    } else {
      delete payload.image;
      delete payload.imageUrl;
    }
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true, runValidators: true }
    ).populate("clinics", "name city");
    if (!doctor) return sendError(res, "Doctor not found", 404);
    return sendSuccess(res, doctor, "Doctor updated successfully");
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
    return sendSuccess(res, null, "Doctor deactivated successfully");
  } catch (err) {
    next(err);
  }
};

module.exports = { getDoctors, getDoctorById, createDoctor, updateDoctor, deleteDoctor };
