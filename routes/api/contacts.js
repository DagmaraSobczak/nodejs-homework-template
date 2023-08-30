const express = require("express");
const router = express.Router();
const ctrlContacts = require("../../controller.js/controller");
const auth = require("../../middelware/auth");

router.get("/", ctrlContacts.get);

router.get("/:contactId", auth, ctrlContacts.getById);

router.post("/", auth, ctrlContacts.create);

router.delete("/:contactId", auth, ctrlContacts.remove);

router.put("/:contactId", auth, ctrlContacts.update);

router.patch("/:contactId/favorite", auth, ctrlContacts.updateFavorite);

module.exports = router;
