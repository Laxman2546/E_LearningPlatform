const jwt = require("jsonwebtoken");

const generateToken = (admin) => {
  return jwt.sign(
    { email: admin.email, id: admin._id },
    process.env.SECRET_KEY
  );
};

module.exports = generateToken;
