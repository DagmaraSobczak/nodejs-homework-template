const express = require("express");
const nanoid = require("nanoid");
const Joi = require("joi");
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../../models/contacts");
const router = express.Router();

const contactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^\(\d{3}\) \d{3}-\d{4}$/)
    .message("Phone number must be in the format XXX-XXX-XXXX")
    .required(),
});

router.get("/", async (_, res) => {
  try {
    const contacts = await listContacts();

    contacts.length > 0
      ? res.json({
          status: 200,
          data: {
            contacts,
          },
        })
      : res.status(404).json({
          status: 404,
          message: "Not found",
        });
  } catch (err) {
    console.error(err.message);
  }
});

router.get("/:contactId", async (req, res) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);

    contact
      ? res.json({
          status: 200,
          data: {
            contact,
          },
        })
      : res.status(404).json({
          status: 404,
          message: "Not found",
        });
  } catch (err) {
    console.error(err.message);
  }
});

router.post("/", async (req, res) => {
  try {
    console.log("Request body before validation:", req.body);
    const body = await contactSchema.validateAsync(req.body);
    console.log("Request body after validation:", body);

    const contact = { id: nanoid(), ...body };
    await addContact(contact);

    res.status(201).json({
      status: 201,
      data: {
        contact,
      },
    });
  } catch (err) {
    console.error("Server error:", err);

    res.status(400).json({
      status: 400,
      message: "Validation error",
    });
  }
});

router.delete("/:contactId", async (req, res) => {
  try {
    const { contactId } = req.params;
    const condition = await removeContact(contactId);

    condition
      ? res.json({
          status: 200,
          message: "contact deleted",
        })
      : res.status(404).json({
          status: 404,
          message: "Not found",
        });
  } catch (err) {
    console.error(err.message);
  }
});

router.put("/:contactId", async (req, res) => {
  try {
    const { contactId } = req.params;

    const { error } = contactSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: "missing fields" });
    }

    const contact = await updateContact(contactId, req.body);

    if (contact) {
      res.json({
        status: 200,
        data: {
          contact,
        },
      });
    } else {
      res.status(404).json({
        status: 404,
        message: "Not found",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err.details[0].message,
    });
  }
});

module.exports = router;
