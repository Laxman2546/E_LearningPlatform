const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const ejs = require("ejs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const flash = require("connect-flash");
const session = require("express-session");
const nodemailer = require("nodemailer");
const cors = require("cors");

require("dotenv").config();
//routers
const adminRouter = require("./routes/adminRouter");
const courseRoute = require("./routes/coursesRoute");
const videosRoute = require("./routes/videosRoute");
const communityRoute = require("./routes/communityRouter");
const generativeRouter = require("./routes/generativeRouter");

const app = express();
const db = require("./config/mongooes-Connection");
const details = require("./config/det");
//models Setup

const userModel = require("./models/user");
const adminModel = require("./models/admin");
const courseModel = require("./models/course");
const videoModel = require("./models/videos");
const enrolledModel = require("./models/enrolled");
const { enrolledCourses } = require("./controllers/coursesController");
const course = require("./models/course");
const user = require("./models/user");
const generateToken = require("./utils/generateToken");
const communityModel = require("./models/community");
// Middleware setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

const storage = multer.memoryStorage();
var upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extName = fileTypes.test(file.originalname.toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);
    if (extName && mimeType) {
      cb(null, true);
    } else {
      cb(new Error("Only .jpg, .jpeg, or .png files are allowed!"));
    }
  },
});

function isloggedin(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    req.flash("error", "You must be logged in to access this page.");
    return res.redirect("/");
  }
  try {
    const data = jwt.verify(token, process.env.SECRET_KEY);
    req.user = data;
    next();
  } catch (err) {
    console.log("JWT verification failed:", err);
    req.flash("error", "Invalid or expired session. Please log in again.");
    res.redirect("/");
  }
}

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.use("/admin", adminRouter);
app.use("/course", courseRoute);
app.use("/video", videosRoute);
app.use("/community", communityRoute);
app.use("/generative", generativeRouter);

app.get("/courses", isloggedin, async (req, res) => {
  try {
    const { email } = req.user;
    const courses = await courseModel.find();
    const user = await userModel.findOne({ email });
    if (!user) {
      req.flash("error", "User not found,please login agian");
      return res.redirect("/");
    }

    if (user.profileImage && user.profileImage.data) {
      user.profileImage.data = `data:${
        user.profileImage.contentType
      };base64,${user.profileImage.data.toString("base64")}`;
    } else {
      user.profileImage = { data: "/images/default.png" };
    }

    const enrolledCourses = await enrolledModel
      .find({ userEmail: email })
      .select("title");
    const enrolledTitles = new Set(enrolledCourses.map((ec) => ec.title));

    const coursesWithEnrollment = courses.map((course) => ({
      ...course.toObject(),
      isEnrolled: enrolledTitles.has(course.title),
    }));

    const groupedCourses = coursesWithEnrollment.reduce((result, course) => {
      const category = course.category || "Uncategorized";
      if (!result[category]) {
        result[category] = [];
      }
      result[category].push(course);
      return result;
    }, {});
    res.render("courses", {
      user,
      courses: coursesWithEnrollment,
      groupedCourses,
    });
  } catch (err) {
    console.error("Error fetching user data:", err);
    req.flash("error", "An error occurred while loading courses.");
    res.redirect("/login");
  }
});

app.get("/profile", isloggedin, async (req, res) => {
  try {
    const { email } = req.user;
    const user = await userModel.findOne({ email });
    if (!user) {
      req.flash("error", "User not found.");
      return res.redirect("/login");
    }
    const enrolledCourses = await enrolledModel.find({ userEmail: email });
    if (user.profileImage && user.profileImage.data) {
      user.profileImage.data = `data:${
        user.profileImage.contentType
      };base64,${user.profileImage.data.toString("base64")}`;
    } else {
      user.profileImage = { data: "/images/default.png" };
    }
    res.render("profile", { user, enrolledCourses });
  } catch (err) {
    console.error("Error retrieving profile:", err);
    req.flash("error", "An error occurred while loading the profile.");
    res.redirect("/courses");
  }
});

app.post(
  "/profile/update",
  isloggedin,
  upload.single("profileImage"),
  async (req, res) => {
    try {
      const { username, address, occupation } = req.body;
      const { email } = req.user;
      const updateData = { username, address, occupation };

      if (req.file) {
        updateData.profileImage = {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        };
      }

      const existingUsername = await userModel.findOne({
        username,
        email: { $ne: email },
      });

      if (existingUsername) {
        req.flash("error", "Username already exists. Try another!");
        return res.redirect("/profile");
      }

      const updatedUser = await userModel.findOneAndUpdate(
        { email },
        updateData,
        { new: true }
      );

      if (!updatedUser) {
        req.flash("error", "User not found. Unable to update profile.");
        return res.redirect("/profile");
      }
      const updatedCommunity = await communityModel.findOneAndUpdate(
        { email },

        {
          username,
          occupation,
          profileImage: req.file
            ? {
                data: req.file.buffer,
                contentType: req.file.mimetype,
              }
            : undefined,
        },
        { new: true }
      );
      if (!updatedCommunity) {
        const newCommunityEntry = await communityModel.create({
          email,
          username,
          profileImage: req.file
            ? {
                data: req.file.buffer,
                contentType: req.file.mimetype,
              }
            : undefined,
        });
      }

      req.flash("success", "Profile updated successfully!");
      res.redirect("/profile");
    } catch (err) {
      console.error("Error updating profile:", err);
      req.flash(
        "error",
        "An unexpected error occurred while updating the profile."
      );
      res.redirect("/profile");
    }
  }
);

app.post("/profile/unenroll", isloggedin, async (req, res) => {
  const { email } = req.user;
  try {
    if (!email) {
      req.flash("error", "something went wrong .Tryagain!");
    }
    const { title } = req.body;
    const unenroll = await enrolledModel.findOneAndDelete({
      userEmail: email,
      title,
    });
    if (unenroll) {
      req.flash("success", ` ${title} unenrolled successfully!`);
      return res.redirect("/profile");
    }
    return req.flash("error", "something went wrong");
  } catch (error) {
    return req.flash("error", "sorry we have an internal issue");
  }
});
app.post("/profile/continue", isloggedin, async (req, res) => {
  const email = req.user.email;
  const user = await userModel.findOne({ email });
  if (user) {
    if (user.profileImage && user.profileImage.data) {
      user.profileImage.data = `data:${
        user.profileImage.contentType
      };base64,${user.profileImage.data.toString("base64")}`;
    } else {
      user.profileImage = { data: "/images/default.png" };
    }
    const { title } = req.body;
    const courses = await videoModel.findOne({ videoTitle: title });
    const course = await courseModel.findOne({ title: title });
    if (!course) {
      req.flash("error", "something went wrong");
      return res.redirect("/courses");
    }
    return res.render("userLearning", {
      user,
      courses,
      course,
      courseId: course._id,
    });
  }
  res.send("user not found");
});
let otpStorage = {};

app.post("/create", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (user) {
      req.flash("error", "User already exists. Try logging in.");
      return res.redirect("/register");
    }
    const otp = randomNumberGenerator();
    otpStorage[email] = { otp, expiresAt: Date.now() + 10 * 60 * 1000 };

    emailGenerator({ email, username }, otp);
    req.flash("success", "OTP sent to your email.");
    return res.render("registerOtp", { email, username, password });
  } catch (err) {
    console.error("Error during registration:", err);
    req.flash("error", "An error occurred during registration.");
    res.redirect("/register");
  }
});

app.post("/new", async (req, res) => {
  const { email, otp, password, username } = req.body;
  if (!email) {
    req.flash("error", "something went wrong try again!");
  }
  if (!otpStorage[email]) {
    req.flash("error", "OTP expired or invalid email.");
    return res.redirect("/forgot");
  }

  const { otp: storedOtp, expiresAt } = otpStorage[email];

  if (Date.now() > expiresAt) {
    delete otpStorage[email];
    req.flash("error", "OTP has expired. Please request a new one.");
    return res.redirect("/forgot");
  }

  if (parseInt(otp, 10) === storedOtp) {
    delete otpStorage[email];

    req.flash("success", "OTP verified successfully!");

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ email: newUser.email }, process.env.SECRET_KEY, {
      expiresIn: "24h",
    });

    res.cookie("token", token, { httpOnly: true, secure: false });
    req.flash("success", "Registration successful!");
    res.redirect("/courses");
  } else {
    req.flash("error", "Invalid OTP. Please try again.");
    return res.redirect("/forgot");
  }
});

const randomNumberGenerator = () => {
  const number = Math.floor(1000 + Math.random() * 9000);
  return number;
};

const emailGenerator = (user, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: details.email,
      pass: details.password,
    },
  });

  const mailOptions = {
    from: details.email,
    to: user.email || email,
    subject: "Study Lane - Verify Your Email",
    html: `
      <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f9f9f9; color: #333;">
    <div style="max-width: 600px; margin: 20px auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #7808d0; margin: 0;">The Study Lane</h1>
      </div>
      <div style="text-align: center;">
        <p style="font-size: 16px; line-height: 1.6;">
        Hello <strong>buddy</strong>,
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          We received a request to <strong>[complete your account registration/reset your password]</strong> on <strong>The Study Lane</strong>. To proceed, please verify your request by using the One-Time Password (OTP) below:
        </p>
        <div style="
          display: inline-block;
          background: #f0f0f0;
          padding: 10px 20px;
          font-size: 20px;
          font-weight: bold;
          color: #7808d0;
          border-radius: 8px;
          margin-top: 10px;
        ">
          ${otp}
        </div>
        <p style="font-size: 14px; line-height: 1.6; margin-top: 20px; color: #555;">
          This OTP is valid for the next <strong>15 minutes</strong>. Please do not share it with anyone to ensure your account’s security.
        </p>
        <p style="font-size: 14px; line-height: 1.6; color: #555;">
          If you did not initiate this request, please ignore this email or contact our support team immediately.
        </p>
      </div>
      <div style="margin-top: 20px; text-align: center; font-size: 14px; color: #777;">
        Thank you, <br />
        <strong>Team StudyLane</strong>
      </div>
    </div>
  </body>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

app.get("/forgot", (req, res) => {
  res.render("forgot");
});
app.get("/reset", (req, res) => {
  res.render("resetpassword");
});

app.post("/forgot", async (req, res) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email: email });

  if (!user) {
    req.flash("error", "Email ID not found");
    return res.redirect("/forgot");
  }

  const otp = randomNumberGenerator();
  otpStorage[email] = { otp, expiresAt: Date.now() + 10 * 60 * 1000 };

  emailGenerator(user, otp);
  req.flash("success", "OTP sent to your email.");
  return res.render("otp", { email });
});

// app.get("/login/federated/google", passport.authenticate("google"));

// // Configure Passport Google Strategy
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "http://localhost:3000/success", // Update with your URL
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         // Find or create the user in your database
//         let user = await userModel.findOne({ googleId: profile.id });

//         if (!user) {
//           user = new user({
//             googleId: profile.id,
//             email: profile.emails[0].value,
//             username: profile.displayName,
//           });
//           await user.save();
//         }

//         // Generate JWT token
//         const token = jwt.sign(
//           { userId: user._id, email: user.email },
//           process.env.JWT_SECRET,
//           { expiresIn: "1h" }
//         );

//         // Pass the user and token to the next middleware
//         done(null, { user, token });
//       } catch (err) {
//         done(err, null);
//       }
//     }
//   )
// );

// // Serialize user
// passport.serializeUser((user, done) => {
//   done(null, user);
// });

// // Deserialize user
// passport.deserializeUser((obj, done) => {
//   done(null, obj);
// });

// app.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// app.get(
//   "/courses",
//   passport.authenticate("google", { failureRedirect: "/" }),
//   async function (req, res) {
//     try {
//       const token = jwt.sign(
//         { email: req.user.email },
//         process.env.SECRET_KEY,
//         {
//           expiresIn: "24h",
//         }
//       );

//       res.cookie("token", token, { httpOnly: true, secure: false });
//       req.flash("success", "Login successful!");
//       return res.redirect("/courses");
//     } catch (error) {
//       console.error("Error during callback processing:", error);
//       req.flash("error", "An error occurred. Please try again.");
//       return res.redirect("/");
//     }
//   }
// );

// app.get("/success", (req, res) => {
//   res.send("success");
// });
// app.get("/dashboard", (req, res) => {
//   if (req.isAuthenticated()) {
//     res.send(`Welcome, ${req.user.name}!`); // req.user contains the logged-in user's data
//   } else {
//     res.redirect("/"); // Redirect to home if not authenticated
//   }
// });

// Route to handle OTP verification
app.post("/check", (req, res) => {
  const { email, otp } = req.body;
  if (!email) {
    req.flash("error", "something went wrong try again!");
  }
  if (!otpStorage[email]) {
    req.flash("error", "OTP expired or invalid email.");
    return res.redirect("/forgot");
  }

  const { otp: storedOtp, expiresAt } = otpStorage[email];

  if (Date.now() > expiresAt) {
    delete otpStorage[email];
    req.flash("error", "OTP has expired. Please request a new one.");
    return res.redirect("/forgot");
  }
  if (parseInt(otp, 10) === storedOtp) {
    delete otpStorage[email];

    req.flash("success", "OTP verified successfully!");
    return res.render("resetpassword", { email: email });
  } else {
    req.flash("error", "Invalid OTP. Please try again.");
    return res.redirect("/forgot");
  }
});
app.post("/passwordChange", async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    req.flash("error", "something went wrong try again!");
  }
  const updatePassword = password;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(updatePassword, salt);
  const user = await userModel.findOneAndUpdate(
    { email: email },
    { password: hashedPassword },
    { new: true }
  );
  if (!user) {
    req.flash("error", "something went wrong");
    res.redirect("/login");
  }
  req.flash("success", "Password reset successfully!");
  res.redirect("/login");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      req.flash("error", "Invalid email or password.");
      return res.redirect("/login");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.flash("error", "Invalid email or password.");
      return res.redirect("/login");
    }

    const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY, {
      expiresIn: "24h",
    });

    res.cookie("token", token, { httpOnly: true, secure: false });
    req.flash("success", "Login successful!");
    res.redirect("/courses");
  } catch (err) {
    console.error("Error during login:", err);
    req.flash("error", "An error occurred during login.");
    res.redirect("/login");
  }
});

app.get("/logout", (req, res) => {
  res.cookie("token", "", { expires: new Date(0), httpOnly: true });
  res.redirect("/login");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
