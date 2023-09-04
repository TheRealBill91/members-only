const express = require("express");
const router = express.Router();
const RateLimit = require("express-rate-limit");

const authMiddlware = require("../middleware/authorization");
const messageController = require("../controllers/messageController");

router.get(
  "/createmessage",
  authMiddlware.userAuthentication,
  messageController.create_message_get
);

const createMessageLimiter = RateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 4, // Limit each IP to 4 create message requests per `window` (here, per hour)
  message:
    "Too many messages created from this IP, please try again after an hour",
  standardHeaders: "draft-7", // draft-6: RateLimit-* headers; draft-7: combined RateLimit header
  legacyHeaders: false, // X-RateLimit-* headers
});

router.post(
  "/createmessage",
  authMiddlware.userAuthentication,
  createMessageLimiter,
  messageController.create_message_post
);

router.get(
  "/message/:id/delete",
  authMiddlware.adminAuthorization,
  messageController.message_delete_get
);

router.post(
  "/message/:id/delete",
  authMiddlware.adminAuthorization,
  messageController.message_delete_post
);

router.get("/messages", messageController.message_list);

module.exports = router;
