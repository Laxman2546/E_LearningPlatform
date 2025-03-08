const mongoose = require("mongoose");

const communitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "user",
  },
  questionTitle: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  questionDescription: {
    type: String,
  },
  username: {
    type: String,
  },
  occupation: {
    type: String,
  },
  profileImage: {
    data: Buffer,
    contentType: String,
  },
  likes: {
    type: Number,
  },
  comments: {
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
module.exports = mongoose.model("community", communitySchema);
