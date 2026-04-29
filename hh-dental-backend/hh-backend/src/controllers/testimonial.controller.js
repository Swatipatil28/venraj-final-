const Testimonial = require("../models/Testimonial");
const { sendSuccess, sendError } = require("../utils/response");

// GET /api/testimonials  — public, only active ones
const getTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find({ isActive: true })
      .sort({ displayOrder: 1, createdAt: -1 });
    return sendSuccess(res, testimonials, "Testimonials retrieved");
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/testimonials  — all (including inactive)
const getAllTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find()
      .sort({ displayOrder: 1, createdAt: -1 });
    return sendSuccess(res, testimonials, "All testimonials retrieved");
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/testimonials
const createTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    return sendSuccess(res, testimonial, "Testimonial created", 201);
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/testimonials/:id
const updateTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!testimonial) return sendError(res, "Testimonial not found", 404);
    return sendSuccess(res, testimonial, "Testimonial updated");
  } catch (err) {
    next(err);
  }
};

// DELETE /api/admin/testimonials/:id
const deleteTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!testimonial) return sendError(res, "Testimonial not found", 404);
    return sendSuccess(res, null, "Testimonial removed");
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTestimonials,
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
};
