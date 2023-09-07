const express = require("express");
const router = express.Router();
const authController = require("../../controller.js/auth.contollers");

router.post("/signin", authController.signin);
router.post("/signup", authController.signup);
router.get("/current", authController.current);
router.get("/logout", authController.logout);

module.exports = router;
