const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  courseId: { type: mongoose.Types.ObjectId },
  category: { type: String, required: true },
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  courseImage: { type: String },
  duration: { type: String, required: true },
  createdBy: { type: String, required: true },
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

module.exports = mongoose.model("Course", courseSchema);
