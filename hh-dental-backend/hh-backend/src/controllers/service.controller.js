const Service = require("../models/Service");
const { sendSuccess, sendError } = require("../utils/response");

// GET /api/services
const getServices = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category.toLowerCase();

    const services = await Service.find(filter).sort({ displayOrder: 1, createdAt: 1 });

    // Shape to match frontend DTO (id field)
    const shaped = services.map((s) => ({
      _id: s._id,
      id: s._id,
      title: s.title,
      category: s.category,
      description: s.description,
      benefits: s.benefits,
      process: s.process,
      icon: s.icon,
      image: s.image || s.imageUrl || "",
    }));

    return sendSuccess(res, shaped, "Services retrieved");
  } catch (err) {
    next(err);
  }
};

// GET /api/services/:id
const getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findOne({
      _id: req.params.id,
      isActive: true,
    });
    if (!service) return sendError(res, "Service not found", 404);

    return sendSuccess(res, {
      _id: service._id,
      id: service._id,
      title: service.title,
      category: service.category,
      description: service.description,
      benefits: service.benefits,
      process: service.process,
      icon: service.icon,
      image: service.image || service.imageUrl || "",
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/services
const createService = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    const image = req.body.image || req.body.imageUrl;
    if (image) payload.image = image;
    const service = await Service.create(payload);
    return sendSuccess(res, service, "Service created successfully", 201);
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/services/:id
const updateService = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    const image = req.body.image || req.body.imageUrl;
    if (image) {
      payload.image = image;
    } else {
      delete payload.image;
      delete payload.imageUrl;
    }
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true, runValidators: true }
    );
    if (!service) return sendError(res, "Service not found", 404);
    return sendSuccess(res, service, "Service updated successfully");
  } catch (err) {
    next(err);
  }
};

// DELETE /api/admin/services/:id
const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!service) return sendError(res, "Service not found", 404);
    return sendSuccess(res, null, "Service deactivated successfully");
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};
