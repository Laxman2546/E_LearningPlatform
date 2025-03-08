const mongoose = require("mongoose");

const enrolledSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  courseImage: { type: String },
  createdBy: { type: String },
  enrolledAt: {
    type: String,
    default: () => {
      const date = new Date();
      const day = date.getDate();
      const month = date.toLocaleString("default", { month: "short" });
      const year = date.getFullYear().toString().slice(-2);
      return `${day} ${month} ${year}`;
    },
  },
  userEmail: { type: String, required: true }, // Email of the user enrolling
});

// Add a compound unique index for userEmail and title
enrolledSchema.index({ userEmail: 1, title: 1 }, { unique: true });

module.exports = mongoose.model("Enrolled", enrolledSchema);
