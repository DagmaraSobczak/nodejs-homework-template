const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  try {
    const data = await fs.readFile(contactsPath, { encoding: "utf8" });
    const contacts = JSON.parse(data);
    return contacts;
  } catch (error) {
    console.error("Błąd podczas odczytu kontaktów:", error);
    return [];
  }
};

const getContactById = async (contactId) => {
  try {
    const contacts = await listContacts();
    return contacts.find((contact) => contact.id === contactId) || null;
  } catch (error) {
    console.error("error", error);
    return null;
  }
};

const removeContact = async (contactId) => {
  try {
    const contacts = await listContacts();
    const filteredContacts = contacts.filter(
      (contact) => contact.id !== contactId
    );
    if (contacts.length === filteredContacts.length) return false;

    await fs.writeFile(contactsPath, JSON.stringify(filteredContacts));
    return true;
  } catch (error) {
    console.error("error", error);
    return false;
  }
};

const addContact = async (body) => {
  try {
    const { name, email, phone } = body;
    const newContact = {
      id: nanoid(),
      name,
      email,
      phone,
    };

    const contacts = await listContacts();
    contacts.push(newContact);

    await fs.writeFile(contactsPath, JSON.stringify(contacts));
    return newContact;
  } catch (error) {
    console.error("error", error);
    return null;
  }
};

const updateContact = async (contactId, body) => {
  try {
    const contacts = await listContacts();
    const contactIndex = contacts.findIndex(
      (contact) => contact.id === contactId
    );
    if (contactIndex === -1) return null;

    const updatedContact = { ...contacts[contactIndex], ...body };
    contacts[contactIndex] = updatedContact;

    await fs.writeFile(contactsPath, JSON.stringify(contacts));
    return updatedContact;
  } catch (error) {
    console.error("error", error);
    return null;
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
