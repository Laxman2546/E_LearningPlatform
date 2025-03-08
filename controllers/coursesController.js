const uploadCourseImage = require("../middleware/multer");
const admin = require("../middleware/isAdmin");
const { adminProfile } = require("./AdminController");
const adminModel = require("../models/admin");
const userModel = require("../models/user");
const videoModel = require("../models/videos");
const videos = require("../models/videos");

module.exports.courseCreate = async (req, res) => {
  try {
    const { category, title, description, courseImage, duration, createdBy } =
      req.body;

    const existingCourse = await courseModel.findOne({ title });

    if (existingCourse) {
      req.flash("error", "A course with the same title already exists.");

      return res.status(400).render("createCourse", {
        errorMessage: "A course with the same title already exists.",
        title,
        description: req.body.description || "",
        category: req.body.category || "",
        duration: req.body.duration || "",
      });
    }

    const newCourse = await courseModel.create({
      category,
      title,
      description,
      courseImage: req.file
        ? `/uploads/courseImages/${req.file.filename}`
        : null,
      duration,
      createdBy,
    });
    req.flash("success", "Course created successfully.");
    return res.status(200).redirect("/course/createcourse");
  } catch (error) {
    req.flash("error", "something went wrong please try again later.");
    return res.status(500).redirect("/course/createcourse");
  }
};

module.exports.courseController = async (req, res) => {
  try {
    const { email } = req.admin;
    const admin = await adminModel.findOne({ email });

    if (!admin) {
      return res.status(401).send("You are not an admin.");
    }
    return res.render("createCourse", { admin });
  } catch (err) {
    console.error("Error in courseController:", err.message);
    return res.status(500).send("Something went wrong.");
  }
};

module.exports.courseDashboard = async (req, res) => {
  try {
    const admin = await adminModel.findOne();
    const courses = await courseModel.find();

    const groupedCourses = courses.reduce((result, course) => {
      const category = course.category || "Uncategorized";
      if (!result[category]) {
        result[category] = [];
      }
      result[category].push(course);
      return result;
    }, {});

    res.render("courseDashboard", { groupedCourses, admin });
  } catch (err) {
    console.error("Error fetching courses:", err);
    res.render("courseDashboard", { groupedCourses: {} });
  }
};

module.exports.courseDelete = async (req, res) => {
  try {
    const { title } = req.body;

    const courseToDelete = await courseModel.findOneAndDelete({ title });

    if (!courseToDelete) {
      req.flash("error", "Course not found or could not be deleted.");
      return res.redirect("/course/dashboard");
    }
    req.flash("success", "Course deleted successfully.");
    return res.redirect("/course/dashboard");
  } catch (error) {
    console.error("Error deleting course:", error);
    req.flash("error", "Something went wrong. Please try again later.");
    return res.redirect("/course/dashboard");
  }
};
module.exports.courseManage = async (req, res) => {
  try {
    const { title } = req.body; // Ensure `title` is coming from the form

    const courseManage = await courseModel.findOne({ title }); // Find the course by title
    if (!courseManage) {
      req.flash("error", "Course not found.");
      return res.redirect("/course/dashboard");
    }
    return res.render("courseManage", {
      courseManage,
      courseId: courseManage._id,
    });
  } catch (error) {
    console.error("Error in courseManage:", error);
    req.flash("error", "Something went wrong. Please try again.");
    return res.redirect("/course/dashboard");
  }
};

module.exports.courseUpdate = async (req, res) => {
  try {
    const { courseId } = req.body;
    const courseUpdate = await courseModel.findById(courseId);
    if (!courseUpdate) {
      req.flash("error", "we are not able to update the course");
      return res.send("something went wrong");
    }
    return res.render("courseEdit", { courseUpdate });
  } catch (error) {
    console.error("Error something went wrong while redirecting:", error);
    req.flash("error", "Something went wrong. Please try again later.");
    return res.send("error");
  }
};

module.exports.courseEdit = async (req, res) => {
  try {
    const { title, category, description, duration, createdBy } = req.body;
    if (!title) {
      req.flash("error", "Title is missing.");
      return res.redirect("/course/dashboard");
    }

    const courseEdit = await courseModel.findOne({ title });
    if (!courseEdit) {
      req.flash("error", "No course found to edit.");
      return res.redirect("/course/dashboard");
    }

    const updateData = await courseModel.updateOne(
      { title },
      {
        category,
        description,
        courseImage: req.file
          ? `/uploads/courseImages/${req.file.filename}`
          : courseEdit.courseImage,
        duration,
        createdBy,
      }
    );

    if (!updateData.modifiedCount) {
      req.flash("error", "Failed to update course.");
      return res.redirect("/course/dashboard");
    }

    req.flash("success", "Course updated successfully.");
    res.redirect("/course/dashboard");
  } catch (err) {
    console.error("Error:", err);
    req.flash("error", "An error occurred.");
    return res.redirect("/course/dashboard");
  }
};

const mongoose = require("mongoose");

module.exports.courseUpload = async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      req.flash("error", "Invalid course ID.");
      return res.redirect("/course/dashboard");
    }

    const courseUpload = await courseModel.findById(courseId);
    if (!courseUpload) {
      req.flash(
        "error",
        "We are not able to upload the video. Course not found."
      );
      return res.redirect("/course/dashboard");
    }

    req.flash("success", "Redirecting to the edit page.");
    return res.render("uploadVideo", { courseUpload, courseId });
  } catch (error) {
    console.error("Error in courseUpload:", error.message);
    req.flash("error", "Something went wrong. Please try again later.");
    return res.redirect("/course/dashboard");
  }
};
const enrolledModel = require("../models/enrolled");
const courseModel = require("../models/course");
//user courses
module.exports.enroll = async (req, res) => {
  const { title } = req.body;
  const userEmail = req.user.email;
  const btnEnroll = req.body;

  if (!userEmail) {
    req.flash("error", "User not logged in.");
    return res.redirect("/login");
  }

  try {
    // Check if the course exists
    const course = await courseModel.findOne({ title });
    if (!course) {
      req.flash("error", "Course not found.");
      return res.redirect("/courses");
    }

    const alreadyEnrolled = await enrolledModel.findOne({
      title,
      userEmail,
    });

    if (alreadyEnrolled) {
      req.flash("error", `You are already enrolled in ${title} course`);
      return res.redirect("/courses");
    }

    await enrolledModel.create({
      title: course.title,
      description: course.description,
      courseImage: course.courseImage,
      createdBy: course.createdBy,
      userEmail,
    });

    req.flash("success", `Successfully enrolled in the ${title} .`);
    res.redirect("/courses");
  } catch (error) {
    console.error("Error enrolling in course:", error);
    req.flash("error", "An error occurred. Please try again.");
    res.redirect("/courses");
  }
};

module.exports.learning = async (req, res) => {
  const email = req.user.email;
  const user = await userModel.findOne({ email });
  if (user) {
    if (user.profileImage && user.profileImage.data) {
      user.profileImage.data = `data:${
        user.profileImage.contentType
      };base64,${user.profileImage.data.toString("base64")}`;
    } else {
      user.profileImage = { data: "/images/default.png" };
    }
    const { title } = req.body;
    const courses = await videoModel.findOne({ videoTitle: title });
    const course = await courseModel.findOne({ title: title });
    if (!course) {
      req.flash("error", "something went wrong");
      return res.redirect("/courses");
    }
    return res.render("userLearning", {
      user,
      courses,
      course,
      courseId: course._id,
    });
  }
  res.send("user not found");
};

module.exports.videos = async (req, res) => {
  try {
    const { courseId } = req.body;
    const singleCourse = await courseModel.findById(courseId);
    const courseVideos = await videoModel
      .find({ courseId })
      .sort({ createdAt: -1 });

    if (!singleCourse || courseVideos.length === 0) {
      console.log("No course or videos found for courseId:", courseId);
      req.flash("error", "No videos available for this course.");
      return res.redirect("/courses");
    }

    res.render("userVideo", {
      singleCourse,
      courseVideos,
    });
  } catch (error) {
    console.error("Error rendering video page:", error.message);
    req.flash("error", "An error occurred while loading the video page.");
    return res.redirect("/courses");
  }
};
