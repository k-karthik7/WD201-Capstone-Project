/* eslint-disable no-unused-vars */
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const csrf = require("tiny-csrf");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const connectEnsureLogin = require("connect-ensure-login");
const session = require("express-session");
const LocalStrategy = require("passport-local");

const flash = require("connect-flash");
const { Admin, Voters } = require("./models");
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser("ssh!!!! some secret string"));
app.use(csrf("this_should_be_32_character_long", ["POST", "PUT", "DELETE"]));
app.use(bodyParser.json());
app.use(flash());

app.use(
  session({
    secret: "my-super-secret-key-125321545455115449673",
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (username, password, done) => {
      Admin.findOne({ where: { email: username, password: password } })
        .then(async (user) => {
          return done(null, user);
          // const result = await bcrypt.compare(password, user.password)
        })
        .catch((error) => {
          // return done(null, false, { message: "Email is not valid" });
          return error;
        });
    }
  )
);

passport.serializeUser((user, done) => {
  console.log("Serializing user in session", user.id);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  Admin.findByPk(id)
    .then((user) => {
      done(null, user);
    })
    .catch((error) => {
      done(error, null);
    });
});

app.set("view engine", "ejs");

app.get("/", (request, response) => {
  response.render("homepage", {
    csrfToken: request.csrfToken(),
  });
});

app.get("/adminsignup", (request, response) => {
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
    request.login(admin, (err) => {
      if (err) {
        console.log(err);
      }
      response.redirect("/adminpage");
    });
  } catch (error) {
    console.log(error);
  }
  // request.flash("info", "Sign up successfull")
});

app.get("/admins", (request, response) => {
  console.log(request.body);
});

app.get(
  "/adminpage",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    response.render("admin-page", {
      firstName: Admin.firstName,
      csrfToken: request.csrfToken(),
    });
  }
);

app.get("/login", (request, response) => {
  response.render("login", {
    csrfToken: request.csrfToken(),
  });
});

app.post(
  "/session",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (request, response) => {
    console.log(request.user);
    response.redirect("/adminpage");
  }
);

app.get("/signout", (request, response, next) => {
  request.logout((error) => {
    if (error) {
      return next(error);
    }
    response.redirect("/");
  });
});

app.get(
  "/admin/addVoter",
  connectEnsureLogin.ensureLoggedIn(),
  (request, response) => {
    response.render("register-voter", {
      csrfToken: request.csrfToken(),
    });
  }
);

app.post(
  "/admin/addVoter",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    console.log(request.body);
    try {
      const voter = await Voters.create({
        voterId: request.body.voterId,
        password: request.body.password,
      });
      return response.redirect("/adminpage");
    } catch (error) {
      console.log(error);
    }
  }
);

app.get("/election", (request, response) => {
  response.render("create-election", {
    csrfToken: request.csrfToken(),
  });
});
module.exports = app;
