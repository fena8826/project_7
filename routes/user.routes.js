

const express = require("express");
const userRoutes = express.Router();
const passport = require("passport");
const upload = require("../middleware/uploadImage");

const {
  addUserPage,
  viewAllUserPage,
  addNewUser,
  deleteUser,
  editUserPage,
  updateUser,
} = require("../controller/user.controller");




userRoutes.get("/add-user", passport.checkAuthentication, addUserPage);

userRoutes.post(
  "/add-user",
  passport.checkAuthentication,
  upload.single("image"),
  addNewUser
);


userRoutes.get("/view-users", passport.checkAuthentication, viewAllUserPage);


userRoutes.get("/edit-user/:id", passport.checkAuthentication, editUserPage);


userRoutes.post(
  "/update-user/:id",
  passport.checkAuthentication,
  upload.single("image"),
  updateUser
);


userRoutes.get("/delete-user/:id", passport.checkAuthentication, deleteUser);



module.exports = userRoutes;
