const express = require("express");
const router = express.Router();

const authMiddlware = require("../middleware/authorization");
const messageController = require("../controllers/messageController");

router.get(
  "/createmessage",
  authMiddlware.memberAuthorization,
  messageController.create_message_get
);

router.post(
  "/createmessage",
  authMiddlware.memberAuthorization,
  messageController.create_message_post
);

router.get("/messages", messageController.message_list);

module.exports = router;
