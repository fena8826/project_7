const express = require("express");
const { homepage, loginpage, registerpage, singleblog, loginuser,  contactpage, registeruser } = require("../controller/web.controller");
const webroute = express.Router();

webroute.get("/", homepage);
webroute.get("/singleblog/:id", singleblog);
webroute.get("/login", loginpage);
webroute.post("/login", loginuser);
webroute.get("/register", registerpage);
webroute.post("/register", registeruser);
webroute.get("/contact", contactpage);

module.exports = webroute;