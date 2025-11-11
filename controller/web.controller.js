const Blog = require("../models/blog.model");
const User = require("../models/Web.model");

exports.homepage = async (req, res) => {
    try {
        let blogs = await Blog.find();
        res.render("web/home", { blogs });
    } catch (error) {
        console.log("error", error);
        return res.redirect("/");
    }
};

exports.loginpage = (req, res) => {
    try {
        res.render("web/loginpage");
    } catch (error) {
        console.log("error", error);
        return res.redirect("/");
    }
};

exports.loginuser = (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/web/dashboard",
        failureRedirect: "/web/register",
        failureFlash: true
    })(req, res, next);
};

exports.registerpage = (req, res) => {
    try {
        res.render("web/register");
    } catch (error) {
        console.log("error", error);
        return res.redirect("/");
    }
};

exports.registeruser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let user = await User.findOne({ email });

        if (user) {
            console.log("error", "Email already registered!");
            return res.redirect("/web/register");
        }

        user = new User({ name, email, password });
        await user.save();
        console.log("Registered Successfully! Please login.");
        res.redirect("/web/login");
    } catch (err) {
        console.log(err);
        res.redirect("/web/register");
    }
};

exports.singleblog = async (req, res) => {
    try {
        let id = req.params.id;
        let blogs = await Blog.findById(id);
        res.render("web/singleblog", { blogs });
    } catch (error) {
        console.log("error", error);
        return res.redirect("/");
    }

};
exports.contactpage = (req, res) => {
    try {
        res.render("web/contact");
    } catch (error) {
        console.log("error", error);
        return res.redirect("/");
    }
};