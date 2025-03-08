const express = require("express");
const isAdmin = require("../middleware/isAdmin");
const upload = require("../middleware/multer");
const {
  uploadVideo,
  courseDetails,
  renderVideoPage,
} = require("../controllers/videoController");

const router = express.Router();

router.get("/videoDetails", isAdmin, uploadVideo);
router.post("/videoDetails", isAdmin, upload.single("videoImage"), uploadVideo);
router.post("/coursedetails", isAdmin, renderVideoPage);
router.post("/all", isAdmin);
module.exports = router;
