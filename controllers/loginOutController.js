const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { body, validationResult } = require("express-validator");

passport.use(
  "local",
  new LocalStrategy(
    {
      // Fields to accept
      usernameField: "email", // default is username, override to accept email
      passwordField: "password",
      passReqToCallback: true, // allows us to access req in the call back
    },
    async (req, email, password, done) => {
      try {
        const user = await User.findOne({ email: email });
        if (!user) {
          return done(null, false, {
            message: "Incorrect email and/or password",
          });
        }
        const passwordMatch =
          user && (await bcrypt.compare(password, user.password));
        if (!passwordMatch) {
          return done(null, false, {
            message: "Incorrect email and/or password",
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Display login up form
exports.login_get = (req, res, next) => {
  res.render("login_form", {
    pageTitle: "Log in",
    title: "Log in",
  });
};

exports.login_post = [
  body("email").trim().normalizeEmail().escape(),
  body("password").trim().escape(),

  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: {
      type: "messageFailure",
      message: "Invalid email and/or password.",
    },
    successFlash: {
      type: "messageSuccess",
      message: "Successfull logged in.",
    },
  }),
];

exports.logout_get = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
  });
  req.flash("messageSuccess", "Successfully logged out");
  res.redirect("/");
};

// **DELETE THIS BEFORE COMMIT**:
// Follow this when doing form validation for login:  https://www.reddit.com/r/node/comments/p9mb6b/comment/h9zeqsp/?utm_source=share&utm_medium=web2x&context=3
