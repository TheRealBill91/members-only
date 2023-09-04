const express = require("express");
const router = express.Router();
const RateLimit = require("express-rate-limit");

const users_controller = require("../controllers/usersController");
const authMiddlware = require("../middleware/authorization");

router.get("/sign-up", users_controller.signup_get);

const createAccountLimiter = RateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 2, // Limit each IP to 5 create account requests per `window` (here, per hour)
  message:
    "Too many accounts created from this IP, please try again after an hour",
  standardHeaders: "draft-7", // draft-6: RateLimit-* headers; draft-7: combined RateLimit header
  legacyHeaders: false, // X-RateLimit-* headers
});

router.post("/sign-up", createAccountLimiter, users_controller.signup_post);

router.get(
  "/member_enrollment",
  authMiddlware.userAuthentication,
  users_controller.membership_enrollment_get
);

const memberEnrollLimiter = RateLimit({
  windowMs: 3 * 60 * 60 * 1000, // 3 hours
  max: 2, // Limit each IP to 5 create account requests per `window` (here, per hour)
  message:
    "Too many membership enrollments created from this IP, please try again after an hour",
  standardHeaders: "draft-7", // draft-6: RateLimit-* headers; draft-7: combined RateLimit header
  legacyHeaders: false, // X-RateLimit-* headers
});

router.post(
  "/member_enrollment",
  authMiddlware.userAuthentication,
  memberEnrollLimiter,
  users_controller.membership_enrollment_post
);

module.exports = router;
