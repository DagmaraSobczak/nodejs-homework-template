const User = require("../models/usersSchema");
const jwt = require("jsonwebtoken");
const service = require("../service/auth");
const Jimp = require("jimp");
const gravatar = require("gravatar");

const path = require("path");

const fs = require("node:fs").promises;

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !user.validPassword(password)) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Incorrect login or password",
      data: "Bad request",
    });
  }

  const payload = {
    id: user.id,
    username: user.username,
  };

  const secret = process.env.SECRET;
  const token = jwt.sign(payload, secret, { expiresIn: "1h" });
  return res.json({
    status: "success",
    code: 200,
    data: {
      token,
    },
  });
};

const signup = async (req, res, next) => {
  const { email, password } = req.body;
  const avatarURL = gravatar.url(req.body.email, {
    s: "200",
    r: "pg",
    d: "404",
  });
  const user = await User.findOne({ email }).lean();
  if (user) {
    return res.status(409).json({
      status: "error",
      code: 409,
      message: "Email is already in use",
      data: "Conflict",
    });
  }
  try {
    const newUser = new User({ email, avatarURL });

    newUser.setPassword(password);
    await newUser.save();
    return res.status(201).json({
      status: "success",
      code: 201,
      data: {
        message: "Registration successful",
        avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
};

const current = async (req, res, next) => {
  try {
    const userId = req.user;

    const user = await service.getCurrent({ userId });
    if (!user) {
      return res.status(409).json({
        status: "error",
        code: 401,
        message: "Not authorized",
        data: "Conflict",
      });
    }
    res.json({
      status: 200,
      statusText: "OK",
      data: {
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      },
    });
  } catch (err) {
    console.error(err.message);
    next(err);
  }
};

const logout = async (req, res, next) => {
  const userId = req.user;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(401)
        .header("Content-Type", "application/json")
        .json({
          status: "Unauthorized",
          code: 401,
          ResponseBody: {
            message: "Not authorized",
          },
        });
    }

    user.token = null;
    await user.save();

    res.status(204).json({
      status: "no content",
      code: 204,
    });
  } catch (error) {
    next(error);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const uploadedFile = req.file;

    const avatar = await Jimp.read(uploadedFile.path);
    await avatar.cover(250, 250).write(uploadedFile.path);

    const newFileName = `avatar_${req.user._id}.${
      uploadedFile.mimetype.split("/")[1]
    }`;

    const newPath = path.join(__dirname, `../public/avatars/${newFileName}`);

    await fs.rename(uploadedFile.path, newPath);

    const avatarURL = `/avatars/${newFileName}`;
    res.status(200).json({
      status: "success",
      code: 200,
      avatarURL,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signin,
  signup,
  current,
  logout,
  updateAvatar,
};
