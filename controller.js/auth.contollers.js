const User = require("../models/usersSchema");
const jwt = require("jsonwebtoken");
const service = require("../service/auth");

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
    const newUser = new User({ email });
    newUser.setPassword(password);
    await newUser.save();
    return res.status(201).json({
      status: "success",
      code: 201,
      data: {
        message: "Registration successful",
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

module.exports = {
  signin,
  signup,
  current,
  logout,
};
