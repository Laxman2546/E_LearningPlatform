const express = require("express");
const router = express.Router();

const {
  generative,
  generativechat,
} = require("../controllers/generativecController");
const isloggedin = require("../middleware/isLoggedin");

router.get("/jarvis", isloggedin, generative);

router.post("/chat", isloggedin, generativechat);

module.exports = router;
