const express = require("express");
const router = express.Router();

const loginOut_controller = require("../controllers/loginOutController");

router.get("/login", loginOut_controller.login_get);

router.post("/login", loginOut_controller.login_post);

router.get("/logout", loginOut_controller.logout_get);

module.exports = router;
