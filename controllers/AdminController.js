const adminModel = require("../models/admin");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

module.exports.registerdAdmin = async (req, res) => {
  const existingAdmin = await adminModel.find();
  if (existingAdmin.length > 0) {
    return res.send("You dont have access.");
  }
  const { username, email, password } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = await adminModel.create({
      username,
      email,
      password: hashedPassword,
    });
    const token = generateToken(admin);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({ admin, token });
  } catch (err) {
    console.error("Error creating admin:", err);
    return res.status(500).send(err.message);
  }
};

module.exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await adminModel.findOne({ email });
    if (!admin) {
      return res.status(401).send("you are not an admin");
    }
    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res.status(401).send("email or password invalid");
    }
    const token = generateToken(admin);
    res.cookie("token", token);
    return res.status(200).redirect("/admin/profile");
  } catch (err) {
    console.error("Error during login:", err);
    return res.status(500).send("Something went wrong");
  }
};

module.exports.adminProfile = async (req, res) => {
  try {
    const { email } = req.admin;

    const admin = await adminModel.findOne({ email });
    if (!admin) {
      req.flash("error", "User not found.");
      return res.redirect("/admin/login");
    }

    res.render("adminProfile", { admin });
  } catch (err) {
    console.error("Error retrieving profile:", err);
    req.flash("error", "An error occurred while loading the profile.");
    return res.redirect("/admin/login");
  }
};

module.exports.logout = async (req, res) => {
  res.cookie("token", "", { expires: new Date(0), httpOnly: true });
  res.redirect("/admin/login");
};
