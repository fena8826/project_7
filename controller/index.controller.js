const User = require("../models/UserModel");
const otpgenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const { sendEmail } = require("../middleware/sendEmail");

exports.logout = (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
        return false;
      } else {
        res.clearCookie("user");
        return res.redirect("/");
      }
    });
  } catch (error) {
    console.log("Something went wrong in logout:", error);
    return res.redirect("/");
  }
};


exports.loginPage = (req, res) => {
  try {
      req.flash('success', 'Login Success');
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      return res.render("login");
    } else {
      return res.redirect("/dashboard");
    }
  } catch (error) {
    console.log("Something went wrong in loginPage:", error);
    return res.redirect("/");
  }
};


exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      req.flash("error", "User not found!");
      return res.redirect("/");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.flash("error", "Incorrect password!");
      return res.redirect("/");
    }

    res.cookie("user", user._id, { httpOnly: true });
    req.flash("success", "Login successful!");
    return res.redirect("/dashboard");
  } catch (error) {
    console.error("Error in loginUser:", error);
    req.flash("error", "Something went wrong!");
    return res.redirect("/");
  }
};


exports.dashBoard = async (req, res) => {
  try {
    return res.render("dashboard");
  } catch (error) {
    console.log("Something went wrong in dashboard:", error);
    return res.redirect("/");
  }
};

exports.profilePage = async (req, res) => {
  try {
    const userId = req.cookies.user;
    if (!userId) {
      console.log("No user cookie found. Redirecting to login...");
      return res.redirect("/");
    }

    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found in DB. Clearing cookie...");
      res.clearCookie("user");
      return res.redirect("/");
    }

    const imagePath =
      user.image && user.image.startsWith("/uploads/")
        ? user.image
        : "/uploads/default-profile.png";

    return res.render("profile", { user, imagePath });
  } catch (error) {
    console.error("Error in profilePage:", error);
    return res.redirect("back");
  }
};



exports.changePasswordPage = async (req, res) => {
  try {

    const user = req.user;

    if (!user) {
      req.flash("error", "Please login first!");
      return res.redirect("/");
    }


    return res.render("change_pass", { user, error: null, success: null });
  } catch (error) {
    console.error("Error rendering change password page:", error);
    req.flash("error", "Unable to open change password page!");
    return res.redirect("/dashboard");
  }
};



exports.changePassword = async (req, res) => {
  try {
    const { old_password, password, c_password } = req.body;
    const user = req.user;

    if (!user) {
      req.flash("error", "Please login again!");
      return res.redirect("/");
    }


    const isMatch = await bcrypt.compare(old_password, user.password);
    if (!isMatch) {
      return res.render("change_pass", {
        user,
        error: "Old password is incorrect!",
        success: null,
      });
    }


    if (password !== c_password) {
      return res.render("change_pass", {
        user,
        error: "New passwords do not match!",
        success: null,
      });
    }


    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    await User.findByIdAndUpdate(user._id, { password: hashPassword });


    req.logout((err) => {
      if (err) console.log(err);
      req.flash("success", "Password changed successfully! Please log in again.");
      return res.redirect("/");
    });
  } catch (error) {
    console.error("Error in changePassword:", error);
    return res.render("change_pass", {
      user: req.user || null,
      error: "Something went wrong. Try again!",
      success: null,
    });
  }
};




exports.forgotPasswordPage = async (req, res) => {
  try {
    return res.render("auth/forgotpassword");
  } catch (error) {
    console.log("Something went wrong in forgotPasswordPage:", error);
    return res.redirect("/");
  }
};


exports.webpage = async (req, res) => {
  try {
    return res.render("webpages/blogs");
  } catch (error) {
    console.log("Something went wrong in webpage:", error);
    return res.redirect("/");
  }
};


exports.sendEmail = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      console.log("User not found");
      return res.redirect("/");
    }

    const otp = otpgenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const mailMessage = {
      from: "fenamavani37@gmail.com",
      to: user.email,
      subject: "Reset Password for Admin Panel",
      html: `
        <h2>Hello</h2>
        <p>Your reset password PIN is: <b>${otp}</b>.</p>
        <p>This password is valid only for 5 minutes.</p>
        <p>Thank You!</p>
      `,
    };

    sendEmail(mailMessage);
    res.cookie("otp", otp);
    res.cookie("email", user.email);
    return res.render("auth/otp-page");
  } catch (error) {
    console.log("Something went wrong in sendEmail:", error);
    return res.redirect("/");
  }
};


exports.verifyOTP = async (req, res) => {
  try {
    const otp = req.cookies.otp;
    if (otp == req.body.otp) {
      res.clearCookie("otp");
      return res.render("auth/newPassword");
    } else {
      console.log("OTP not verified!");
      return res.redirect("back");
    }
  } catch (error) {
    console.log("Something went wrong in verifyOTP:", error);
    return res.redirect("/");
  }
};


exports.resetPassword = async (req, res) => {
  try {
    const email = req.cookies.email;
    const user = await User.findOne({ email });

    if (!user) return res.redirect("/");

    if (req.body.newpassword !== req.body.cpassword) {
      console.log("pss match");
        req.flash('success', 'Password updated successfully');
      return res.redirect("back");
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.newpassword, salt);

    await User.findByIdAndUpdate(user._id, { password: hashPassword }, { new: true });
    res.clearCookie("email");

    return res.redirect("/");
  } catch (error) {
    console.log("Something went wrong in resetPassword:", error);
    req.flash('error', 'Passwords do not match');
    return res.redirect("back");
  }
};


exports.setAuthenticated = (req, res, next) => {
  if (req.cookies && req.cookies.user) {
    next();
  } else {
    res.redirect("/");
  }
};
