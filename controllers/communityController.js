const userModel = require("../models/user");
const communityModel = require("../models/community");
const commentModel = require("../models/comment");
module.exports.communityMain = async (req, res) => {
  try {
    const { email } = req.user;

    // Fetch user based on email
    const user = await userModel.findOne({ email });

    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/");
    }

    // Handle profile image for the user
    if (user.profileImage && user.profileImage.data) {
      user.profileImage.data = `data:${
        user.profileImage.contentType
      };base64,${user.profileImage.data.toString("base64")}`;
    } else {
      user.profileImage = { data: "/images/default.png" };
    }

    // Fetch all questions from the community model
    const findQuestions = await communityModel
      .find()
      .sort({ createdAt: -1 })
      .limit(10);

    // Use map to process questions and comments
    const processedQuestions = await Promise.all(
      findQuestions.map(async (question) => {
        // Process profile image for the question
        if (question.profileImage && question.profileImage.data) {
          question.profileImage.data = `data:${
            question.profileImage.contentType
          };base64,${question.profileImage.data.toString("base64")}`;
        } else {
          question.profileImage = { data: "/images/default.png" };
        }

        const comments = await commentModel.find({ questionId: question._id });

        const commentCount = await commentModel.countDocuments({
          questionId: question._id,
        });

        // Process profile image for each comment
        const processedComments = comments.map((comment) => {
          if (comment.profileImage && comment.profileImage.data) {
            comment.profileImage.data = `data:${
              comment.profileImage.contentType
            };base64,${comment.profileImage.data.toString("base64")}`;
          } else {
            comment.profileImage = { data: "/images/default.png" };
          }
          return comment;
        });

        return {
          ...question.toObject(),
          comments: processedComments,
          commentCount,
        };
      })
    );

    return res
      .status(200)
      .render("community", { user, findQuestions: processedQuestions });
  } catch (error) {
    console.error("Error in communityMain:", error);
    req.flash("error", "Something went wrong");
    return res.redirect("/courses");
  }
};

module.exports.addQuestion = async (req, res) => {
  try {
    const { questionTitle, questionDescription } = req.body;
    const { email } = req.user;

    // Validate input
    if (!questionTitle) {
      req.flash("error", "Title must be provided.");
      return res.status(400).redirect("/community/page");
    }

    // Find the user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      req.flash("error", "User not found.");
      return res.status(404).redirect("/community/page");
    }

    // Create a new question
    const newQuestion = await communityModel.create({
      questionTitle,
      questionDescription,
      email: user.email,
      profileImage: user.profileImage,
      username: user.username,
      occupation: user.occupation,
    });
    req.flash("success", "Question added successfully.");
    return res.status(200).redirect("/community/page");
  } catch (error) {
    console.error("Error adding question:", error);
    req.flash("error", "An error occurred while adding the question.");
    return res.status(500).redirect("/community/page");
  }
};

const handleProfileImage = (image) => {
  if (image && image.data) {
    return `data:${image.contentType};base64,${image.data.toString("base64")}`;
  }
  return "/images/default.png";
};

module.exports.commentsPage = async (req, res) => {
  const { questionId, commentText } = req.body;
  const { email } = req.user;
  const question = await communityModel.findById(questionId);
  if (!question) {
    console.log("error");
    return res.redirect("/community/page");
  }
  const user = await userModel.findOne({ email });
  if (user.profileImage && user.profileImage.data) {
    user.profileImage.data = `data:${
      user.profileImage.contentType
    };base64,${user.profileImage.data.toString("base64")}`;
  } else {
    user.profileImage = { data: "/images/default.png" };
  }
  if (question.profileImage && question.profileImage.data) {
    question.profileImage.data = `data:${
      question.profileImage.contentType
    };base64,${question.profileImage.data.toString("base64")}`;
  } else {
    question.profileImage = { data: "/images/default.png" };
  }
  if (!user) {
    return res.redirect("error", "something went wrong");
  }
  const existingComment = await commentModel.findOne({
    questionId,
    commentText,
    userId: req.user._id,
  });
  if (existingComment || commentText === "") {
    req.flash("error", "page reloaded");
  } else {
    const newComment = await commentModel.create({
      questionId,
      commentText,
      username: user.username,
      profileImage: user.profileImage,
      userId: req.user._id,
    });
    await newComment.save();
  }

  const comments = await commentModel.find({ questionId });
  res.render(`showcomments`, { questionId, user, question, comments });
};
