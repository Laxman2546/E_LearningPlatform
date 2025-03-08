const multer = require("multer");
const path = require("path");

// Configure disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/courseImages");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname).toLowerCase();
    cb(null, `course-${uniqueSuffix}${fileExtension}`);
  },
});

// File filter to validate file types
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png/;
  const extName = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimeType = allowedFileTypes.test(file.mimetype);

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpg, .jpeg, or .png files are allowed!"), false);
  }
};

// Multer setup
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, 
  },
});

// Export the middleware for course image uploads
module.exports = upload;
