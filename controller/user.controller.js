const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");

// 🟢 Add User Page
exports.addUserPage = async (req, res) => {
  try {
    return res.render("add_user");
  } catch (error) {
    console.log("Error rendering add user page:", error);
    return res.redirect("/dashboard");
  }
};

// 🟢 View All Users Page
exports.viewAllUserPage = async (req, res) => {
  try {
    const users = await User.find();
    return res.render("view_all_user", { users });
  } catch (error) {
    console.log("Error fetching users:", error);
    return res.redirect("/dashboard");
  }
};

// 🟢 Add New User (Admin)
exports.addNewUser = async (req, res) => {
  try {
    let imagePath = "";
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
      req.body.image = imagePath;
    }

    // Hash password before saving
    const hashPassword = await bcrypt.hash(req.body.password, 10);

    const user = await User.create({
      ...req.body,
      password: hashPassword,
      image: imagePath || "/uploads/default-profile.png",
    });

    if (user) {
      console.log("✅ Admin added successfully");
      req.flash("success", "Admin added successfully!");
      // Redirect to View All Users page directly
      return res.redirect("/user/view-users");
    } else {
      console.log("❌ Admin not added");
      req.flash("error", "Admin not added!");
      return res.redirect("/user/add-user");
    }
  } catch (error) {
    console.log("Error adding user:", error);
    req.flash("error", "Something went wrong while adding user!");
    return res.redirect("/dashboard");
  }
};

// 🟢 Edit User Page
exports.editUserPage = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      return res.render("edit_user", { user });
    } else {
      req.flash("error", "User not found!");
      return res.redirect("/user/view-users");
    }
  } catch (error) {
    console.log("Error rendering edit page:", error);
    return res.redirect("/user/view-users");
  }
};

// 🟢 Update User Details
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      if (req.file) {
        // Delete old image if exists
        if (user.image && user.image !== "") {
          const oldImagePath = path.join(__dirname, "..", user.image);
          try {
            fs.unlinkSync(oldImagePath);
          } catch (err) {
            console.log("Old image not found or already deleted.");
          }
        }
        req.body.image = `/uploads/${req.file.filename}`;
      }

      await User.findByIdAndUpdate(user._id, req.body, { new: true });
      req.flash("success", "User updated successfully!");
      return res.redirect("/user/view-users");
    } else {
      req.flash("error", "User not found!");
      return res.redirect("back");
    }
  } catch (error) {
    console.log("Error updating user:", error);
    req.flash("error", "Something went wrong!");
    return res.redirect("back");
  }
};

// 🟢 Delete User
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      // Delete user's image from folder (if any)
      if (user.image && user.image !== "") {
        const imgPath = path.join(__dirname, "..", user.image);
        try {
          fs.unlinkSync(imgPath);
        } catch (err) {
          console.log("Error deleting image file:", err);
        }
      }

      await User.findByIdAndDelete(req.params.id);
      req.flash("success", "User deleted successfully!");
      return res.redirect("back");
    } else {
      req.flash("error", "User not found!");
      return res.redirect("back");
    }
  } catch (error) {
    console.log("Error deleting user:", error);
    req.flash("error", "Something went wrong!");
    return res.redirect("back");
  }
};
