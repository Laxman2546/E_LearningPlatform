const mongoose = require("mongoose");
const course = require("./course");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: { type: String },
  profileImage: {
    data: Buffer,
    contentType: String,
  },
  address: {
    type: String,
  },
  courses: {
    type: Array,
    default: [],
  },
  enrolled: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "enrolled",
    },
  ],
  occupation: {
    type: String,
    default: "student",
  },
});

module.exports = mongoose.model("User", userSchema);
