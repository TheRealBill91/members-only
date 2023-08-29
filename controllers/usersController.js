const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

// Display sign up form
exports.signup_get = (req, res, next) => {
  res.render("sign_up_form", {
    title: "Sign Up",
  });
};

// POST request for user sign up
exports.signup_post = [
  body("first_name", "First name is required")
    .trim()
    .isLength({ min: 1 })
    .withMessage("First name must be at least one letter")
    .escape(),
  body("last_name", "Last name is required")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Last name must be atleast one letter")
    .escape(),
  body("email", "Email is required")
    .trim()
    .isLength({min: 5})
    .withMessage("Email not long enough")
    .isEmail()
    .withMessage("Please enter a valid email (test@example.com")
    .normalizeEmail()
    .escape(),
  body("password", "password is required")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Password must be at least five charcters")
    .escape(),
  body("confirm_password", "You must confirm your password")
    .trim()
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Passwords do not match, try again")
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    console.log(errors.isEmpty())

    console.log(errors.array());

    if (!errors.isEmpty()) {
      res.render("sign_up_form", {
        title: "Sign Up",
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        errors: errors.array(),
      });
    } else {
      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        if (err) {
          console.log("Bcrypt error");
          res.redirect("/sign-up");
        } else {
          const user = new User({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: hashedPassword,
          });
          await user.save();
          res.redirect("/");
        }
      });
    }
  }),
];
