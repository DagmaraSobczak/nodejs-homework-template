const Joi = require("joi");
const service = require("../service/contacts.js");

const contactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^\(\d{3}\) \d{3}-\d{4}$|^\d{3}-\d{3}-\d{4}$/)
    .message(
      "Phone number must be in the format (XXX) XXX-XXXX or XXX-XXX-XXXX"
    )
    .required(),
});

const get = async (_, res, next) => {
  try {
    const contacts = await service.getContacts();

    res.json({
      status: 200,
      statusText: "OK",
      data: {
        contacts,
      },
    });
  } catch (err) {
    console.error(err.message);
    next(err);
  }
};

const getById = async (req, res) => {
  try {
    const { contactId } = req.params;
    const contact = await service.getContactById(contactId);

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
};

const create = async (req, res) => {
  const body = req.body;

  try {
    const contact = await service.createContact(body);

    res.status(201).json({
      status: 201,
      statusText: "Created",
      data: {
        contact,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      statusText: "Bad Request",
      message: err.message,
    });
  }
};

const remove = async (req, res) => {
  try {
    const { contactId } = req.params;
    const condition = await service.removeContact(contactId);

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
};

const update = async (req, res) => {
  try {
    const { contactId } = req.params;

    const { error } = contactSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: "missing fields" });
    }

    const contact = await service.updateContact(contactId, req.body);

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
};
const updateFavorite = async (req, res, next) => {
  const { id } = req.params;
  const body = Object.hasOwn(req.body, "favorite") ? req.body : null;

  try {
    if (body) {
      const contact = await service.updateContact(id, {
        favorite: body.favorite,
      });

      if (!contact) {
        return res.status(404).json({
          status: 404,
          statusText: "Not Found",
          message: `Not found contact by id: ${id}`,
        });
      }

      res.json({
        status: 200,
        statusText: "OK",
        data: {
          contact,
        },
      });
    } else {
      res.status(400).json({
        status: 400,
        statusText: "Bad Request",
        message: "Missing field 'favorite'",
      });
    }
  } catch (err) {
    console.error(err.message);
    next(err);
  }
};

const ctrlContacts = {
  get,
  getById,
  create,
  remove,
  update,
  updateFavorite,
};

module.exports = ctrlContacts;
