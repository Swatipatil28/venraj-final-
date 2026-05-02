const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Doctor name is required"],
      trim: true,
    },
    specialization: {
      type: [String],
      required: [true, "At least one specialization is required"],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "At least one specialization is required",
      },
    },
    experience: {
      type: String,
      required: [true, "Experience is required"],
    },
    qualifications: {
      type: String,
      required: [true, "Qualifications are required"],
    },
    bio: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5"
    },
    clinics: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Clinic",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

doctorSchema.index({ specialization: 1 }); // MongoDB naturally indexes array elements

module.exports = mongoose.model("Doctor", doctorSchema);
