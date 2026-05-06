const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { cloudinary, hasCloudinaryConfig } = require("../utils/cloudinary");

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload only images."), false);
  }
};

let storage;

if (hasCloudinaryConfig()) {
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: process.env.CLOUDINARY_FOLDER || "hh-dental",
      allowed_formats: ["jpg", "png", "jpeg", "webp"],
      transformation: [{ width: 1000, height: 1000, crop: "limit" }],
    },
  });
} else {
  // Fallback to local storage if Cloudinary not configured
  const path = require("path");
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "../../uploads"));
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
  });
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

module.exports = upload;
