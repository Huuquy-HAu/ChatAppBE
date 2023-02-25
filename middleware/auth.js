const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");
const { ACCESS_TOKEN_PRIVATE_KEY, JWT_PASSWORD } = process.env;
const createError = require("http-errors");

exports.checkLogin = async (req, res, next) => {
  try {
    const token = req.cookies["chat-app"];
    const id = jwt.verify(token, JWT_PASSWORD);
    if (!token) {
      return next(createError(401, "Bạn chưa đăng nhập !"));
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
    if(error && error.message === 'invalid signature'){
      return next(createError(401, error.message));
    }
    return next(createError(500, error.message));
  }
};
exports.checkAdmin = async (req, res, next) => {
  if (req.user.role !== "4")
    return next(
      createError(401, "Bạn không phải admin, không có quyền truy cập!")
    );
  next();
};

exports.checkAuth = async (req, res, next) => {
  const token = req.header("chat-app");
  if (!token)
    return res.status(403).json({ error: true, message: "Không có token !" });
  try {
    const tokenDetails = jwt.verify(token, ACCESS_TOKEN_PRIVATE_KEY);
    req.user = tokenDetails;
    next();
  } catch (err) {
    console.log(err);
    res
      .status(403)
      .json({
        error: true,
        message: "Token không hợp lệ, hoặc đã hết thời hạn !",
      });
  }
};
