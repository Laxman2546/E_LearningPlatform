const express = require("express");
const router = express.Router();

const {
  generative,
} = require("../controllers/generativecController");
const isloggedin = require("../middleware/isLoggedin");

router.get("/jarvis", isloggedin, generative);


module.exports = router;
