const mongoose = require("mongoose");
const course = require("./course");

const videoSchema = new mongoose.Schema({
  videoTitle: {
    type: String,
  },
  overview: {
    type: String,
  },
  createdBy: {
    type: String,
    required: true,
  },
  videoHeading: {
    type: String,
    required: true,
  },
  videoLink: {
    type: String,
  },
  videoImage: {
    type: String,
  },
  duration: {
    type: String,
  },
  rating: {
    type: String,
  },
  language: {
    type: String,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "course",
    required: true,
  },
  createdAt: {
    type: String,
    default: () => {
      const date = new Date();
      const day = date.getDate();
      const month = date.toLocaleString("default", { month: "short" });
      const year = date.getFullYear().toString().slice(-2);
      return `${day} ${month} ${year}`;
    },
  },
});

module.exports = mongoose.model("video", videoSchema);
