const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "community", // Reference to the 'community' model
    required: true,
  },
  profileImage: {
    data: Buffer,
    contentType: String,
  },
  commentText: {
    type: String,
  },
  replies: {
    type: String,
  },
  username: {
    type: String,
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

module.exports = mongoose.model("comment", commentSchema);
