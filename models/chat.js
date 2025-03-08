const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    require: true,
  },
  messages: [
    {
      sender: {
        type: String,
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
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

module.exports = mongoose.model("chat", chatSchema);
