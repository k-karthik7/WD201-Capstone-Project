/* eslint-disable no-unused-vars */
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const csrf = require("tiny-csrf");
const cookieParser = require("cookie-parser");

const flash = require("connect-flash");
const { Admin } = require("./models");
const session = require("express-session");
const passport = require("passport");
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser("ssh!!!! some secret string"));
app.use(csrf("this_should_be_32_character_long", ["POST", "PUT", "DELETE"]));
app.use(bodyParser.json());
app.use(flash());

app.set("view engine", "ejs");

app.get("/", (request, response) => {
  response.render("homepage", {
    csrfToken: request.csrfToken(),
  });
});

app.get("/admin-signup", (request, response) => {
  response.render("admin-signup", {
    csrfToken: request.csrfToken(),
  });
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
    response.redirect("/admin-page");
  } catch (error) {
    console.log(error);
  }
  // request.flash("info", "Sign up successfull")
});

app.get("/admins", (request, response) => {
  console.log(request.body);
});

app.get("/admin-page", async (request, response) => {
  response.render("admin-page", {
    firstName: Admin.firstName,
    csrfToken: request.csrfToken(),
  });
});

app.get("/login", (request, response) => {
  response.render("login", {
    csrfToken: request.csrfToken(),
  });
});
module.exports = app;
