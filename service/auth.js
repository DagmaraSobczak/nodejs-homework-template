const User = require("../models/usersSchema");

const getCurrent = async (query) => {
  try {
    return await User.findOne(query).lean();
  } catch (err) {
    console.error(err.message);
  }
};

const signin = async (query) => {
  try {
    return await User.findOne(query).lean();
  } catch (err) {
    console.error(err.message);
  }
};

const signout = async (id) => {
  try {
    return await User.findById({ _id: id });
  } catch (err) {
    console.error(err.message);
  }
};

const signup = async (body) => {
  try {
    return User.create(body);
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = {
  signin,
  signout,
  signup,
  getCurrent,
};
