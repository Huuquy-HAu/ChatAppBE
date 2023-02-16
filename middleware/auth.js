const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");
const { JWT_PASSWORD, JWT_EXPIRED_IN } = process.env;

exports.checkLogin = async (req, res, next) => {
  const token = req.cookies["chat-app"];
  console.log(77777777, token);
  if (token) {
    jwt.verify(token, JWT_PASSWORD, async (err, decodedToken) => {
      if (err) {
        res.redirect("/users/sign-in");
      } else {
        const user = await UserModel.findOne({ _id: decodedToken.id });
        if (user) res.json({ status: true, user: user.gmail });
        req.user = user;
        next();
      }
    });
  } else {
    res.redirect("/users/sign-in");
  }
};
exports.checkAdmin = async (req, res, next) => {
  if (req.user.role !== "4") return res.redirect("users/sign-in");
  next();
};
