const express = require("express");
const router = express.Router();

const message_controller = require("../controllers/messageController");

const RateLimit = require("express-rate-limit");
const homePageLimiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // Limit each IP to 30 home page requests per `window` (here, per minute)
  message: "Too many requests from this IP, please try again after a minute",
  standardHeaders: "draft-7", // draft-6: RateLimit-* headers; draft-7: combined RateLimit header
  legacyHeaders: false, // X-RateLimit-* headers
});

/* GET home page. */
router.get("/", homePageLimiter, message_controller.message_list);

module.exports = router;
