const videoModel = require("../models/videos");
const courseModel = require("../models/course");

module.exports.uploadVideo = async (req, res) => {
  try {
    const {
      courseId,
      videoTitle,
      videoLink,
      videoHeading,
      duration,
      language,
      createdBy,
      rating,
      videoImage,
      overview,
    } = req.body;
    const courseVideo = await courseModel.findById(courseId);
    if (!courseVideo) {
      req.flash("error", "Course not found. from course route");
      return res.redirect("/course/dashboard");
    }
    const newVideo = await videoModel.create({
      videoTitle,
      videoLink,
      duration,
      language,
      videoHeading,
      videoImage: req.file
        ? `/uploads/courseImages/${req.file.filename}`
        : courseVideo.courseImage,
      createdBy,
      rating,
      overview,
      courseId,
    });
    req.flash("success", "Video uploaded successfully.");
    return res.redirect("/course/dashboard");
  } catch (err) {
    console.error("Error in video upload:", err.message);
    req.flash("error", "Failed to upload video. Please try again.");
    return res.redirect("/course/dashboard");
  }
};
module.exports.renderVideoPage = async (req, res) => {
  try {
    const { courseId } = req.body;

    const singleCourse = await courseModel.findById(courseId);
    const courseVideos = await videoModel
      .find({ courseId })
      .sort({ createdAt: -1 });

    if (!singleCourse || courseVideos.length === 0) {
      console.log("No course or videos found for courseId:", courseId);
      req.flash("error", "No videos available for this course.");
      return res.redirect("/course/dashboard");
    }

    res.render("adminVideo", {
      singleCourse,
      courseVideos,
    });
  } catch (error) {
    console.error("Error rendering video page:", error.message);
    req.flash("error", "An error occurred while loading the video page.");
    return res.redirect("/course/dashboard");
  }
};

module.exports.deleteVideo = async (req, res) => {
  try {
    const { videoId } = req.body;

    const video = await videoModel.findById(videoId);
    if (!video) {
      req.flash("error", "Video not found.");
      return res.redirect("/course/dashboard");
    }
    await videoModel.findByIdAndDelete(videoId);
    req.flash("success", "Video deleted successfully.");
    return res.redirect("/course/dashboard");
  } catch (err) {
    console.error("Error in deleting video:", err.message);
    req.flash("error", "Failed to delete the video. Please try again.");
    return res.redirect("/course/dashboard");
  }
};
