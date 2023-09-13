const User = require("../models/usersSchema");
const jwt = require("jsonwebtoken");
const service = require("../service/auth");
const Jimp = require("jimp");
const gravatar = require("gravatar");
const uuid = require("uuid");
const path = require("path");
const emailService = require("../service/email");
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

  if (!user.verify) {
    return res.status(401).json({
      status: "error",
      code: 401,
      message:
        "Account is not verified. Please verify your account before logging in.",
      data: "Unauthorized",
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
require("dotenv").config();
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
    const verificationToken = uuid.v4();
    const newUser = new User({ email, avatarURL, verificationToken });

    newUser.setPassword(password);

    await newUser.save();

    const emailOptions = {
      to: newUser.email,
      subject: "Weryfikacja konta",
      text: `Kliknij poniższy link, aby zweryfikować swoje konto: /users/verify/${newUser.verificationToken}`,
    };

    await emailService.send(emailOptions);

    return res.status(201).json({
      status: "success",
      code: 201,
      data: {
        message: "Registration successful",
        avatarURL,
        verificationToken,
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
          token: user.verificationToken,
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

const verifyUser = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;

    if (!verificationToken) {
      return res.status(400).json({
        status: "fail",
        code: 400,
        message: "Missing verification token",
      });
    }

    const user = await service.verifyUser(verificationToken);

    if (!user) {
      return res.status(404).json({
        status: "fail",
        code: 404,
        message: "User not found",
      });
    }

    const emailOptions = {
      to: user.email,
      subject: "Weryfikacja konta",
      html: `Kliknij <a href="/users/verify/${user.verificationToken}">tutaj</a>, aby zweryfikować swoje konto.`,
    };

    await emailService.send(emailOptions);

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Verification successful",
    });
  } catch (error) {
    next(error);
  }
};

const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Missing required field email" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.verify) {
      return res
        .status(400)
        .json({ message: "Verification has already been passed" });
    }

    user.verificationToken = uuid.v4();
    await user.save();

    const emailOptions = {
      to: user.email,
      subject: "Weryfikacja konta",
      html: `Kliknij <a href="/users/verify/${user.verificationToken}">tutaj</a>, aby zweryfikować swoje konto.`,
    };

    await emailService.send(emailOptions);

    return res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  signin,
  signup,
  current,
  logout,
  updateAvatar,
  verifyUser,
  resendVerificationEmail,
};
