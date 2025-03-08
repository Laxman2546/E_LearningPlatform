const jwt = require("jsonwebtoken");

function isAdmin(req, res, next) {
  const token = req.cookies.token; 
  if (!token) {
    req.flash("error", "You must be logged in to access the admin page.");
    res.clearCookie("token");
    return res.status(401).redirect("/admin/login");
  }

  try {
    const admin = jwt.verify(token, process.env.SECRET_KEY);

    req.admin = {
      id: admin.id,
      email: admin.email,
    };

    next();
  } catch (err) {
    req.flash("error", "Invalid or expired session. Please log in again.");
    res.clearCookie("token");
    return res.status(401).redirect("/admin/login");
  }
}

module.exports = isAdmin;
