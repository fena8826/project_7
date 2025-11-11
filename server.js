const express = require("express");
const port = 9005;
const path = require("path");
const dbconnect = require("./config/DbConnection");
const cookieParser = require("cookie-parser");
const session = require('express-session');
const flash = require('connect-flash');
const passport = require("./middleware/localStrategy");     
const webroute = require("./routes/web.routes");

const app = express();

// View Engine
app.set("view engine", "ejs");

// Static Files
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middlewares
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Session Setup
app.use(session({
    name: "testing",
    secret: "hello",
    saveUninitialized: false,
    resave: true,
    cookie: {
        maxAge: 1000 * 60 * 60
    }
}));



// Passport Setup
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

// 🔹 Custom middleware to make flash messages available in all EJS views
app.use(flash());
app.use((req, res, next) => {
  res.locals.flash = req.flash();
  next();
});
// Routes
app.use("/", require("./routes/index.routes"));
app.use("/web", webroute);

// Server Start
app.listen(port, () => {
  console.log(`✔ Server started at http://localhost:${port}`);
});
