const express = require("express");
const router = express.Router();

const uploadController = require("../../controller.js/upload.controller");
const upload = require("../../middelware/upload");

router.post("/upload", upload.single("avatar"), uploadController.uploadFile);

module.exports = router;
