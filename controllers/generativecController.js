const userModel = require("../models/user");

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
