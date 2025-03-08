const userModel = require("../models/user");
const chatModel = require("../models/chat");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");

dotenv.config();

/**
 * Helper function to get user data with profile image fallback
 */
const getUserWithImage = async (email) => {
  const user = await userModel.findOne({ email });
  if (user && user.profileImage?.data) {
    user.profileImage.data = `data:${
      user.profileImage.contentType
    };base64,${user.profileImage.data.toString("base64")}`;
  } else if (user) {
    user.profileImage = { data: "/images/default.png" };
  }
  return user;
};

/**
 * Renders the generative AI page
 */
module.exports.generative = async (req, res) => {
  try {
    const { email } = req.user;
    const user = await getUserWithImage(email);
    if (!user) {
      req.flash("error", "Please login again!");
      return res.redirect("/");
    }
    return res.render("generative", { user });
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong");
    return res.redirect("/courses");
  }
};

/**
 * Handles user input and generates AI responses
 */
module.exports.generativechat = async (req, res) => {
  try {
    const { email } = req.user;
    const { chat } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      req.flash("error", "Please log in again!");
      return res.redirect("/");
    }

    // Handle user profile image
    if (user.profileImage?.data) {
      user.profileImage.data = `data:${
        user.profileImage.contentType
      };base64,${user.profileImage.data.toString("base64")}`;
    } else {
      user.profileImage = { data: "/images/default.png" };
    }

    // Ensure API key is available
    const geminiApiKey = process.env.API_KEY;
    if (!geminiApiKey) {
      req.flash("error", "Something went wrong, try again later.");
      return res.redirect("/courses");
    }

    // Initialize GoogleGenerativeAI client and model
    const googleAI = new GoogleGenerativeAI(geminiApiKey);
    const geminiModel = googleAI.getGenerativeModel({
      model: "gemini-pro",
      temperature: 0.9,
      topP: 1,
      topK: 1,
      maxOutputTokens: 4096,
    });

    // Initialize chat history if needed
    let userChat = await chatModel.findOne({ userId: user._id });
    if (!userChat) {
      userChat = new chatModel({
        userId: user._id,
        messages: [],
      });
    }

    // Include previous messages as chat history
    const chatHistory = userChat.messages.map((message) => ({
      role: message.sender === "User" ? "user" : "model",
      parts: [{ text: message.message }],
    }));

    // Add the current user input to the chat history
    chatHistory.push({
      role: "user", // Assuming the user is the one sending the input
      parts: [{ text: chat }], // Use "parts" to match the format
    });

    // Generate AI response
    const result = await geminiModel.generateContent({
      contents: chatHistory,
    });

    // Extract AI reply from response
    const response = result.response;
    let aiReply = "";
    if (
      response &&
      response.candidates &&
      response.candidates[0]?.content?.parts
    ) {
      aiReply = response.candidates[0].content.parts
        .map((part) => part.text)
        .join("");
      console.log("AI Reply:", aiReply);
    } else {
      console.error("Unexpected response format:", response);
      aiReply = "Sorry, I could not process your request.";
    }
    userChat.messages.push({ sender: "User", message: chat });
    userChat.messages.push({ sender: "AI", message: aiReply });
    await userChat.save();
    return res.render("chatpage", {
      user,
      chatHistory: userChat.messages,
    });
  } catch (error) {
    console.error("Error:", error);
    req.flash("error", "Something went wrong.");
    return res.redirect("/courses");
  }
};

/**
 * Renders the chat page with chat history
 */
module.exports.getChatPage = async (req, res) => {
  try {
    const { email } = req.user;
    const user = await getUserWithImage(email);
    if (!user) return res.redirect("/");

    const chat = await chatModel.findOne({ userId: user._id });
    const chatHistory = chat ? chat.messages : [];

    return res.render("chatpage", { user, chatHistory });
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong");
    return res.redirect("/courses");
  }
};
