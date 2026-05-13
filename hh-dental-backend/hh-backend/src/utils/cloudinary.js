const cloudinary = require("cloudinary").v2;

let configured = false;

const isValidEnvValue = (value) =>
  typeof value === "string" &&
  value.trim().length > 0 &&
  !/your_|replace_|change_|example/i.test(value);

const hasCloudinaryConfig = () =>
  Boolean(
    isValidEnvValue(process.env.CLOUDINARY_CLOUD_NAME) &&
      isValidEnvValue(process.env.CLOUDINARY_API_KEY) &&
      isValidEnvValue(process.env.CLOUDINARY_API_SECRET)
  );

const configureCloudinary = () => {
  if (configured || !hasCloudinaryConfig()) {
    return;
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  configured = true;
};

// Configure on module load
configureCloudinary();

const uploadBuffer = async (fileBuffer, options = {}) => {
  if (!configured) {
    throw new Error("Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.");
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: process.env.CLOUDINARY_FOLDER || "HH_DENTAL_PROJECT",
        resource_type: "image",
        overwrite: true,
        upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
        ...options,
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      }
    );

    uploadStream.end(fileBuffer);
  });
};

module.exports = { cloudinary, hasCloudinaryConfig, uploadBuffer };
