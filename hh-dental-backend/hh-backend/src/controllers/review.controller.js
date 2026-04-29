const Review = require("../models/Review");
const { sendSuccess, sendError } = require("../utils/response");

// POST /api/reviews  — patient submits a review after appointment
const createReview = async (req, res, next) => {
  try {
    const { appointmentId, patientName, clinicId, serviceId, rating, comment } = req.body;

    if (!appointmentId || !patientName || !rating) {
      return sendError(res, "appointmentId, patientName and rating are required", 400);
    }

    // Prevent duplicate review for same appointment
    const existing = await Review.findOne({ appointmentId });
    if (existing) {
      return sendError(res, "A review for this appointment already exists", 409);
    }

    const review = await Review.create({
      appointmentId,
      patientName,
      clinicId: clinicId || null,
      serviceId: serviceId || null,
      rating,
      comment: comment || "",
      isRequired: true,
      isApproved: false,
    });

    return sendSuccess(res, review, "Review submitted successfully", 201);
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/reviews
const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate("appointmentId", "patientName preferredDate")
      .populate("clinicId", "name city")
      .populate("serviceId", "title")
      .sort({ createdAt: -1 });
    return sendSuccess(res, reviews, "Reviews retrieved");
  } catch (err) {
    next(err);
  }
};

// PATCH /api/admin/reviews/:id/approve
const approveReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    if (!review) return sendError(res, "Review not found", 404);
    return sendSuccess(res, review, "Review approved");
  } catch (err) {
    next(err);
  }
};

module.exports = { createReview, getReviews, approveReview };
