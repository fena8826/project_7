const express = require("express");
const blogRoutes = express.Router();
const passport = require('passport')
const { addBlogPage, viewAllBlogsPage,deleteBlog,addNewBlog ,editBlogPage,updateBlog,viewSingleBlog, MyBlogsPage} = require("../controller/blog.controller");


const upload = require("../middleware/uploadImage");
const { webpage } = require("../controller/index.controller");
blogRoutes.get("/add-blog",passport.checkAuthentication,  addBlogPage);
blogRoutes.get("/view-all-blogs",passport.checkAuthentication,  viewAllBlogsPage);
blogRoutes.get("/my-blogs",passport.checkAuthentication,  MyBlogsPage);
blogRoutes.get("/single-blog/:id",passport.checkAuthentication,  viewSingleBlog);
blogRoutes.post("/add-blog", upload.single("image"), addNewBlog);
blogRoutes.get("/edit_blog/:id",passport.checkAuthentication,  editBlogPage);
blogRoutes.get("/delete-blog/:id", deleteBlog);
blogRoutes.post("/update-blog/:id", upload.single("image"), updateBlog);
blogRoutes.get("/webpage",webpage)

module.exports = blogRoutes;
