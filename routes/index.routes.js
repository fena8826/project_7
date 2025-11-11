const express = require('express');
const routes = express.Router();
const passport = require('passport');

const {
  dashBoard,
  loginPage,
  loginUser,
  logout,
  profilePage,
  changePassword,
  changePasswordPage,
  forgotPasswordPage,
  sendEmail,
  verifyOTP,
  resetPassword
} = require("../controller/index.controller");

// 🟢 Auth & Dashboard
routes.get("/", loginPage);
routes.post(
  "/login",
  passport.authenticate('local', { failureRedirect: "/", failureFlash: true }),
  loginUser
);
routes.get("/dashboard", passport.checkAuthentication, dashBoard);
routes.get("/logout", logout);

// 🟢 Profile & Change Password
routes.get("/profile", passport.checkAuthentication, profilePage);
routes.get("/change-password", passport.checkAuthentication, changePasswordPage);
routes.post("/change-password", passport.checkAuthentication, changePassword);

// 🟢 Forgot Password & OTP
routes.get("/forgot-password", forgotPasswordPage);
routes.post("/send-email", sendEmail);
routes.post("/verify-otp", verifyOTP);
routes.post("/reset-password", resetPassword);

// 🟢 Other Routes
routes.use("/user", require('./user.routes'));
routes.use("/blog", require('./blog.routes'));
routes.use("/web", require('./web.routes'));

module.exports = routes;
