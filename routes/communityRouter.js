const express = require("express");
const isloggedin = require("../middleware/isLoggedin");
const {
  communityMain,
  addQuestion,
  postComments,
  postComment,
  commentsPage,
} = require("../controllers/communityController");
const router = express.Router();

router.get("/page", isloggedin, communityMain);

router.get("/postcomment", isloggedin, commentsPage);

router.post("/addquestion", isloggedin, addQuestion);

router.post("/postcomment", isloggedin, commentsPage);

module.exports = router;
