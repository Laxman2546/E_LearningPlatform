const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: { type: String },
  isadmin: {
    type: Boolean,
  },
});

module.exports = mongoose.model("admin", adminSchema);
