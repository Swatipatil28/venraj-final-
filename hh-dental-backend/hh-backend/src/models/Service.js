const mongoose = require("mongoose");
const { SERVICE_CATEGORY } = require("../config/constants");

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Service title is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: Object.values(SERVICE_CATEGORY),
        message: "Category must be dental or aesthetic",
      },
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    benefits: {
      type: [String],
      default: [],
    },
    process: {
      type: [String],
      default: [],
    },
    icon: {
      type: String,
      default: "◈",
    },
    image: {
      type: String,
      default: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5"
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

serviceSchema.index({ category: 1, isActive: 1 });

module.exports = mongoose.model("Service", serviceSchema);
