const express = require("express");
const router = express.Router();

const users_controller = require("../controllers/usersController");

router.get("/sign-up", users_controller.signup_get);

router.post("/sign-up", users_controller.signup_post);

module.exports = router;
