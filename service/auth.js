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
const updateAvatarUrl = async (id, avatarURL) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      { _id: id },
      { avatarURL },
      { new: true }
    );
    return updatedUser;
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  signin,
  signout,
  signup,
  getCurrent,
  updateAvatarUrl,
};
