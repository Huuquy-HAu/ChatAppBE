const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");
const { JWT_PASSWORD, JWT_EXPIRED_IN } = process.env;

exports.checkLogin = async (req, res, next) => {
  const token = req.cookies["chat-app"];
  console.log(77777777, token);
  if (token) {
    jwt.verify(token, JWT_PASSWORD, async (err, decodedToken) => {
      if (err) {
        // res.redirect("/users/sign-in");
        return res.status(500).json({ mess: "chưa đăng nhập!" });
      } else {
        const user = await UserModel.findOne({ _id: decodedToken.id });
        if (user) res.json({ status: true });
        req.user = user;
        next();
      }
    });
  } else {
    // res.redirect("/users/sign-in");
    return res.status(500).json({ mess: "chưa đăng nhập!" });
  }
};
exports.checkAdmin = async (req, res, next) => {
  if (req.user.role !== "4")
    return res
      .status(404)
      .json({ mess: "Bạn không phải admin không có quyền truy cập !" });
  next();
};
