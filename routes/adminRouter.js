const express = require("express");
const router = express.Router();
const {
  registerdAdmin,
  loginAdmin,
  adminProfile,
  logout,
} = require("../controllers/AdminController");
const isAdmin = require("../middleware/isAdmin");

router.get("/login", (req, res) => {
  res.render("adminLogin");
});
router.get("/logout", logout);
router.get("/profile", isAdmin, adminProfile);
router.post("/register", registerdAdmin);
router.post("/login", loginAdmin);

module.exports = router;
