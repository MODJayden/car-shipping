const cloudinary = require("cloudinary").v2;
const multer = require("multer");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.API_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

// Multer configuration for multiple images
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"), false);
    }
    cb(null, true);
  },
});

// Upload multiple images to Cloudinary
const uploadMultipleImages = async (files) => {
  if (!files || files.length === 0) throw new Error("No files provided");

  try {
    const uploadedResults = await Promise.all(
      files.map(async (file) => {
        const b64 = Buffer.from(file.buffer).toString("base64");
        const dataURI = `data:${file.mimetype};base64,${b64}`;

        return await cloudinary.uploader.upload(dataURI, {
          resource_type: "image",
          folder: "products",
          public_id: `img_${Date.now()}`,
          overwrite: false,
        });
      })
    );

    return {
      success: true,
      results: uploadedResults.map((res) => ({
        url: res.secure_url,
        publicId: res.public_id,
        width: res.width,
        height: res.height,
      })),
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return {
      success: false,
      message: error.message || "Upload failed",
      error,
    };
  }
};

// Express middleware for multiple files
const handleUploadImages = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: "No image files provided",
    });
  }

  const { success, results, message, error } = await uploadMultipleImages(
    req.files
  );

  if (!success) {
    return res.status(500).json({
      success: false,
      message: message || "Image upload failed",
      error,
    });
  }

  res.status(200).json({
    success: true,
    data: results,
  });

  next();
};

module.exports = {
  upload, // Use upload.array("product", 5) in your route
  handleUploadImages,
};
