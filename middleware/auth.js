const { json } = require("express");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");
const { JWT_PASSWORD, JWT_EXPIRED_IN } = process.env;
const createError = require("http-errors");

exports.checkLogin = async (req, res, next) => {
  const token = req.cookies["chat-app"];
  // console.log(8888, token);
  const id = jwt.verify(token, JWT_PASSWORD);
  // console.log(1000, id.id);
  try {
    if (!token) {
      return next(createError(401, "Bạn chưa đăng nhập"));
    } else {
      const user = await UserModel.findOne({ _id: id.id });
      if (!user) {
        return next(createError(401, " Không tìm thấy thông tin người dùng !"));
      } else {
        req.user = user;
        next();
      }
    }
  } catch (error) {
    return next(createError(500, error.message));
  }
};
exports.checkAdmin = async (req, res, next) => {
  if (req.user.role !== "4")
    return next( createError(401, 'Bạn không phải admin, không có quyền truy cập!'))
  next();
};
