const Blog = require("../models/blog.model");
const path = require("path");
const fs = require("fs");
const User = require("../models/UserModel");


exports.addBlogPage = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.redirect("/user/login");

    return res.render("add_blog", { user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.redirect("/");
  }
};


exports.viewAllBlogsPage = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.redirect("/user/login");

    let filter = {};

    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { author: { $regex: req.query.search, $options: "i" } },
      ];
    }

    if (req.query.category) {
      filter.category = req.query.category;
    }

    const blogs = await Blog.find(filter).sort({ createdAt: -1 });
    const categories = await Blog.distinct("category");

    return res.render("view-all-blogs", {
      user,
      blogs,
      categories,
      search: req.query.search || "",
      category: req.query.category || "",
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return res.redirect("/");
  }
};

exports.MyBlogsPage = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.redirect("/user/login");

    const blogs = await Blog.find({ userId: user._id }).sort({ createdAt: -1 });
    return res.render("my_blogs", { blogs, user });
  } catch (error) {
    console.error("Error fetching my blogs:", error);
    return res.redirect("/");
  }
};

exports.addNewBlog = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.redirect("/user/login");

    let imagePath = "";
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
      req.body.image = imagePath;
    }

    const author = `${user.firstname} ${user.lastname}`;

    await Blog.create({
      ...req.body,
      author,
      userId: user._id,
    });

    return res.redirect("/blog/my-blogs");
  } catch (error) {
    console.error("Error adding blog:", error);
    return res.redirect("/");
  }
};


exports.viewSingleBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.redirect("/blog/view-all-blogs");

    let user = req.user || null;

    return res.render("single-blog", { blog, user });
  } catch (error) {
    console.error("Error fetching single blog:", error);
    return res.redirect("/blog/view-all-blogs");
  }
};


exports.editBlogPage = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.redirect("/user/login");

    const blog = await Blog.findById(req.params.id);

    if (blog && blog.userId.toString() === user._id.toString()) {
      return res.render("edit_blog", { blog, user });
    } else {
      return res.redirect("back");
    }
  } catch (error) {
    console.error("Error loading edit page:", error);
    return res.redirect("/blog/my-blogs");
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const user = req.user;
    const blog = await Blog.findById(req.params.id);

    if (blog && blog.userId.toString() === user._id.toString()) {
      await Blog.findByIdAndDelete(req.params.id);
      return res.redirect("back");
    } else {
      return res.redirect("/login");
    }
  } catch (error) {
    console.error("Error deleting blog:", error);
    return res.redirect("/blog/my-blogs");
  }
};


exports.updateBlog = async (req, res) => {
  try {
    const user = req.user;
    const blog = await Blog.findById(req.params.id);

    if (blog && blog.userId.toString() === user._id.toString()) {
      if (req.file) {
        let imagePath = "";
        if (blog.image) {
          imagePath = path.join(__dirname, "..", blog.image);
          try {
            fs.unlinkSync(imagePath);
          } catch {
            console.log("Old image not found...");
          }
        }
        req.body.image = `/uploads/${req.file.filename}`;
      }

      await Blog.findByIdAndUpdate(blog._id, req.body, { new: true });
      return res.redirect("/blog/my-blogs");
    } else {
      console.error("Error updating blog:", error);
    return res.redirect("/blog/my-blogs");
    }
  } catch (error) {
    console.error("Error updating blog:", error);
    return res.redirect("/blog/my-blogs");
  }
};
