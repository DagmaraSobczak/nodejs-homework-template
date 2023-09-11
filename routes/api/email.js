const express = require("express");
const router = express.Router();
const emailController = require("../../controller.js/email.controller");

router.post("/send", emailController.send);

module.exports = router;
