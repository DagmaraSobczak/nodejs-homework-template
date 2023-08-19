const Contact = require("./contactsSchema");

const getContacts = async () => {
  try {
    return await Contact.find();
  } catch (err) {
    console.error(err.message);
  }
};

const getContactById = async (id) => {
  try {
    return await Contact.findById({ _id: id });
  } catch (err) {
    console.error(err.message);
  }
};

const createContact = async (body) => {
  try {
    return Contact.create(body);
  } catch (err) {
    console.error(err.message);
  }
};

const removeContact = async (id) => {
  try {
    return await Contact.findByIdAndRemove(id);
  } catch (err) {
    console.error(err.message);
  }
};

const updateContact = async (id, body) => {
  try {
    return await Contact.findByIdAndUpdate(id, body, {
      new: true,
    });
  } catch (err) {
    console.error(err.message);
  }
};

const updateFavorite = async (id, favorite) => {
  return Contact.findByIdAndUpdate(
    id,
    { favorite },
    {
      new: true,
    }
  );
};

const service = {
  getContacts,
  getContactById,
  createContact,
  removeContact,
  updateContact,
  updateFavorite,
};

module.exports = service;
