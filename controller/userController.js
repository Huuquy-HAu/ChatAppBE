const UserModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const {
  JWT_PASSWORD,
  ACCESS_TOKEN_PRIVATE_KEY,
  ACCESS_TOKEN_TIME,
} = process.env;
const createError = require("http-errors");
const MAIL_FORMAT = /^([a-zA-Z0-9_\.\-])+\@gmail.com/;
const generateTokens = require("../utils/generateTokens");
const { refreshTokenBodyValidation } = require("../utils/validationSchema");
const verifyRefreshToken = require("../utils/verifyRefreshToken");
const UserToken = require("../models/userToken");

//lấy thông tin tất cả user chỉ dành cho admin
exports.getAllUser = async (req, res, next) => {
  try {
    let user = await UserModel.find({ _id: { $ne: req.params.id } }).lean();
    sendSuccess(res, "getUser thành công!", user);
  } catch (error) {
    return next(createError(500, error.message));
  }
};
//tạo mới user
exports.createNewUser = async (req, res, next) => {
  const userName = req.body.userName;
  const gmail = req.body.gmail;
  const password = req.body.password;
  try {
    if (!userName || !gmail || !password) {
      return next(createError(400, "Không để trống thông tin !"));
    } else if (!MAIL_FORMAT.test(gmail)) {
      return next(createError(400, "Sai định dạng gmail !"));
    } else if (password.length < 6) {
      return next(createError(400, "Mật khẩu ít nhất phải dài 6 ký tự !"));
    }

    const check = await UserModel.findOne({ userName: userName });
    if (check) {
      return next(createError(400, "Username đã tồn tại !"));
    }

    const checkGmail = await UserModel.findOne({ gmail: gmail });
    if (checkGmail) {
      return next(createError(400, "Gmail đã tồn tại !"));
    }

    const jwtPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      userName: req.body.userName,
      gmail: req.body.gmail,
      password: jwtPassword,
    });

    delete user._doc.password;
    sendSuccess(res, "Create user success", user);
  } catch (error) {
    next(createError(500, error.message));
  }
};
//đăng nhập
exports.signIn = async (req, res, next) => {
  try {
    const checkUser = await UserModel.findOne({ gmail: req.body.gmail });
    if (!checkUser) {
      return next(createError(400, "Sai gmail !"));
    }

    const checkPassWord = await bcrypt.compare(
      req.body.password,
      checkUser.password
    );
    if (!checkPassWord) {
      return next(createError(400, "Sai password !"));
    }

   
    const { accessToken, refreshToken } = await generateTokens(checkUser);
   
    sendSuccess(res, "Log-in success", {
      _id: checkUser._id,
      userName: checkUser.userName,
      gmail: checkUser.gmail,
      avatar: checkUser.avatar,
      // token,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(createError(500, error.message));
  }
};
//lấy thông tin của 1 user
exports.getOneUser = async (req, res, next) => {
  try {
    let user = await UserModel.findOne({ _id: req.params.id });
    sendSuccess( res, 'Lấy thông tin thành công!', user )
  } catch (error) {
    next(createError( 500, error.message))
  }
};
//chỉnh sửa thông tin cá nhân
exports.changeInformation = async (req, res, next) => {
  try {
    const token = req.cookies["chat-app"];
    const id = jwt.verify(token, JWT_PASSWORD);
    const user = await UserModel.updateOne(
      { _id: id.id },
      {
        fullName: req.body.fullName,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
        gender: req.body.gender,
      }
    );
    sendSuccess(res, "Sửa thông tin người dùng thành công !", user);
  } catch (error) {
    next(createError(500, error.message));
  }
};
//đổi mật khẩu
exports.changeUserPassword = async (req, res, next) => {
  try {
    const checkUser = await UserModel.findOne({ gmail: req.body.gmail });
    if (!checkUser) {
      return next(createError(400, "Sai gmail !"));
    }

    const checkPassWord = await bcrypt.compareSync(
      req.body.password,
      checkUser.password
    );
    if (!checkPassWord) {
      return next(createError(400, "Sai password !"));
    }
    const changePass = await UserModel.updateOne(
      { _id: checkUser._id },
      { password: bcrypt.hashSync(req.body.newPassword, 10) }
    );

    sendSuccess(res, "Đổi mật khẩu thành công !", changePass);
  } catch (error) {
    next(createError(500, error.message));
  }
};

//đổi ảnh đại diện
exports.uploadAvatar = async (req, res, next) => {
  try {
    const token = req.cookies["chat-app"];
    const id = jwt.verify(token, JWT_PASSWORD);
    const update = await UserModel.updateOne(
      { _id: id.id },
      { avatar: req.file.path }
    );

    if (update.modifiedCount === 0) {
      update;
      fs.unlinkSync(req.file.filename);
    }
    sendSuccess(res, "Thay đổi avatar thành công !", update);
  } catch (error) {
    next(createError(500, error.message));
  }
};
//tạo mới accessToken
exports.createAccessToken = async (req, res, next) => {
  try {
    const { error } = refreshTokenBodyValidation(req.body);
    if (error) {
      return res
        .status(400)
        .json({ error: true, message: error.details[0].message });
    }

    verifyRefreshToken(req.body.refreshToken)
      .then(({ tokenDetails }) => {
        const payload = { _id: tokenDetails._id };
        const accessToken = jwt.sign(payload, ACCESS_TOKEN_PRIVATE_KEY, {
          expiresIn: ACCESS_TOKEN_TIME,
        });
        res.status(200).json({
          error: false,
          accessToken,
          message: "Create accessToken success!",
        });
      })
      .catch((err) => res.status(400).json(err));
  } catch (error) {
    res.status(500).json({ message: "Server Internal error" });
  }
};
//đăng xuất
exports.logOut = async (req, res, next) => {
  try {
    const { error } = refreshTokenBodyValidation(req.body);
    if (error)
      return res
        .status(400)
        .json({ error: true, message: error.details[0].message });

    const userToken = await UserToken.findOne({ token: req.body.refreshToken });
    if (!userToken)
      return res
        .status(200)
        .json({ error: false, message: "Đăng xuất thành công!" });

    await userToken.remove();
    res.status(200).json({ error: false, message: "Đăng xuất thành công!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};
