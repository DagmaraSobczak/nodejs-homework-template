const express = require("express");
const router = express.Router();
const ctrlContacts = require("../../controller.js/controller");

router.get("/contacts", ctrlContacts.get);

router.get("/contacts/:id", ctrlContacts.getById);

router.post("/contacts", ctrlContacts.create);

router.delete("/contacts/:id", ctrlContacts.remove);

router.put("/contacts/:id", ctrlContacts.update);

router.patch("/contacts/:contactId/favorite");

module.exports = router;
