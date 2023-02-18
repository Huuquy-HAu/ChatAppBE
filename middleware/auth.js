const { json } = require("express");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");
const { JWT_PASSWORD, JWT_EXPIRED_IN } = process.env;

exports.checkLogin = async (req, res, next) => {
  const token = req.cookies["chat-app"];
  console.log(8888, token);
  const id = jwt.verify(token, JWT_PASSWORD);
  console.log(1000, id.id);
  try {
    if (!token) {
      return res.status(400).json({ mess: "Chưa đăng nhập !" });
    } else {
      const user = await UserModel.findOne({ _id: id.id });
      if (!user) {
        return res
          .status(400)
          .json({ mess: "token không hợp lệ, không tìm thấy người dùng !" });
      } else {
        req.user = user;
        next();
      }
    }
  } catch (error) {
    res.status(500).json({ mess: "server error", error });
  }
};
// exports.checkAdmin = async (req, res, next) => {
//   if (req.user.role !== "4")
//     return res
//       .status(404)
//       .json({ mess: "Bạn không phải admin không có quyền truy cập !" });
//   next();
// };
