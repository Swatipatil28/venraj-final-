const Service = require("../models/Service");
const { sendSuccess, sendError } = require("../utils/response");
const { emitEvent } = require("../utils/socket");

const shapeService = (service) => ({
  _id: service._id,
  id: service._id,
  title: service.title,
  name: service.title,
  category: service.category,
  description: service.description,
  benefits: Array.isArray(service.benefits) ? service.benefits : [],
  process: Array.isArray(service.process) ? service.process : [],
  processSteps: Array.isArray(service.process) ? service.process : [],
  icon: service.icon,
  image: service.image || "",
});

const broadcastServices = async () => {
  const services = await Service.find({ isActive: true }).sort({ displayOrder: 1, createdAt: 1 });
  emitEvent("serviceUpdated", services.map(shapeService));
};

const getServices = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category.toLowerCase();

    const services = await Service.find(filter).sort({ displayOrder: 1, createdAt: 1 });
    return sendSuccess(res, services.map(shapeService), "Services retrieved");
  } catch (err) {
    next(err);
  }
};

const getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findOne({
      _id: req.params.id,
      isActive: true,
    });
    if (!service) return sendError(res, "Service not found", 404);

    return sendSuccess(res, shapeService(service));
  } catch (err) {
    next(err);
  }
};

const { uploadBuffer } = require("../utils/cloudinary");

const uploadServiceImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return sendError(res, "Please upload an image file", 400);
    }

    // Manually upload to Cloudinary using the buffer
    console.log("Starting Cloudinary upload for file:", req.file.originalname);
    const result = await uploadBuffer(req.file.buffer, {
      folder: process.env.CLOUDINARY_FOLDER || "HH_DENTAL_PROJECT"
    });

    return sendSuccess(
      res,
      {
        url: result.secure_url,
        publicId: result.public_id,
      },
      "Image uploaded successfully"
    );
  } catch (err) {
    console.error("Cloudinary Manual Upload Error:", err);
    // Specifically catch 403 to give better advice
    if (err.http_code === 403) {
      return sendError(res, "Cloudinary Access Denied (403). Please verify your API Secret and account status.", 403);
    }
    next(err);
  }
};

const createService = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    const image = req.body.image || req.body.imageUrl;
    if (image) payload.image = image;

    const service = await Service.create(payload);
    await broadcastServices();
    return sendSuccess(res, shapeService(service), "Service created successfully", 201);
  } catch (err) {
    next(err);
  }
};

const updateService = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    const image = req.body.image || req.body.imageUrl;
    const public_id = req.body.public_id;

    const existingService = await Service.findById(req.params.id);
    if (!existingService) return sendError(res, "Service not found", 404);

    if (image) {
      // If a new image is provided and there was an old image, delete the old one
      if (image !== existingService.image && existingService.public_id) {
        try {
          const { cloudinary } = require("../utils/cloudinary");
          await cloudinary.uploader.destroy(existingService.public_id);
        } catch (e) {
          console.error("Failed to delete old image from Cloudinary:", e);
        }
      }
      payload.image = image;
      if (public_id) {
        payload.public_id = public_id;
      }
    } else {
      delete payload.image;
      delete payload.imageUrl;
      delete payload.public_id;
    }

    const service = await Service.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });

    await broadcastServices();
    return sendSuccess(res, shapeService(service), "Service updated successfully");
  } catch (err) {
    next(err);
  }
};

const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!service) return sendError(res, "Service not found", 404);

    await broadcastServices();
    return sendSuccess(res, null, "Service deactivated successfully");
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getServices,
  getServiceById,
  uploadServiceImage,
  createService,
  updateService,
  deleteService,
};
