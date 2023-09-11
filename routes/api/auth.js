const express = require("express");
const auth = require("../../middelware/auth");
const router = express.Router();
const authController = require("../../controller.js/auth.contollers");
const upload = require("../../middelware/upload");

router.post("/signin", authController.signin);
router.post("/signup", authController.signup);
router.get("/current", authController.current);
router.get("/logout", authController.logout);
router.patch(
  "/avatars",
  auth,
  upload.single("avatar"),
  authController.updateAvatar
);
router.get("/verify/:verificationToken", auth, authController.verifyUser);
router.post("/verify", auth, authController.resendVerificationEmail);

module.exports = router;
