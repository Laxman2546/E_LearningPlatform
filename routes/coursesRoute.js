const express = require("express");
const {
  courseCreate,
  courseController,
  courseDashboard,
  courseDelete,
  courseManage,
  courseUpdate,
  courseEdit,
  courseUpload,
  uploadVideo,
  enroll,
  learning,
  videos,
  enrolledCourses,
} = require("../controllers/coursesController");
const isAdmin = require("../middleware/isAdmin");
const upload = require("../middleware/multer");
const isloggedin = require("../middleware/isLoggedin");

const router = express.Router();

// Routes
router.get("/createcourse", isAdmin, courseController);
router.get("/dashboard", isAdmin, courseDashboard);
router.get("/manage", isAdmin, courseManage);
router.get("/edit", isAdmin, courseUpdate);
router.get("/upload", isAdmin, courseUpload);
router.post("/learning", isloggedin, learning);
router.post("/newcourse", isAdmin, upload.single("courseImage"), courseCreate);
router.post("/delete", isAdmin, courseDelete);
router.post("/manage", isAdmin, courseManage);
router.post("/edit", isAdmin, courseUpdate);
router.post("/upload", isAdmin, courseUpload);
router.post("/enroll", isloggedin, enroll);
router.post("/video", isloggedin, videos);
router.post("/update", isAdmin, upload.single("courseImage"), courseEdit);

module.exports = router;
