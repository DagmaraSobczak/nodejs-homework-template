const express = require("express");

const router = express.Router();
const authController = require("../../controller.js/auth.contollers");
const upload = require("../../middelware/upload");

router.post("/signin", authController.signin);
router.post("/signup", authController.signup);
router.get("/current", authController.current);
router.get("/logout", authController.logout);
router.patch(
  "/avatars",

  upload.single("avatar"),
  authController.updateAvatars
);

module.exports = router;
