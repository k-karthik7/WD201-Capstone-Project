/* eslint-disable no-unused-vars */
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const { Admin } = require("./models");
const session = require("express-session");
const passport = require("passport");
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(flash());

app.set("view engine", "ejs");

app.get("/", (request, response) => {
  response.render("homepage");
});

app.get("/admin-signup", (request, response) => {
  response.render("admin-signup");
});

app.post("/admin", async (request, response) => {
  console.log(request.body);
  try {
    const admin = await Admin.create({
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      email: request.body.email,
      password: request.body.password,
    });
    response.redirect("/login");
  } catch (error) {
    console.log(error);
  }
  // request.flash("info", "Sign up successfull")
});

app.get("/admins", (request, response) => {
  console.log(request.body);
});

app.get("/admin-page", async (request, response) => {
  response.render("admin-page", { firstName: Admin.firstName });
});

app.get("/login", (request, response) => {
  response.render("login");
});
module.exports = app;
