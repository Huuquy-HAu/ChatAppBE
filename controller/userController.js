const UserModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const { JWT_PASSWORD, JWT_EXPIRED_IN } = process.env;
const createError = require("http-errors");
const MAIL_FORMAT = /^([a-zA-Z0-9_\.\-])+\@gmail.com/;
const generateTokens = require("../utils/generateTokens");

const createToken = (id) => {
  return jwt.sign({ id }, JWT_PASSWORD, {
    expiresIn: JWT_EXPIRED_IN,
  });
};

exports.getAllUser = async (req, res, next) => {
  try {
    let user = await UserModel.find({ _id: { $ne: req.params.id } }).lean();
    sendSuccess(res, "getUser thành công!", user);
  } catch (error) {
    // console.log(20,error);
    return next(createError(500, error.message));
  }
};

exports.createNewUser = async (req, res, next) => {
  const userName = req.body.userName;
  const gmail = req.body.gmail;
  const password = req.body.password;
  try {
    if (!userName || !gmail || !password) {
      return next(createError(400, "Không để trống thông tin !"));
      // return res.status(400).json({ message: "Không để trống thông tin !" });
    } else if (!MAIL_FORMAT.test(gmail)) {
      return next(createError(400, "Sai định dạng gmail !"));
      // return res.status(400).json({ message: "Sai định dạng gmail !" });
    } else if (password.length < 6) {
      return next(createError(400, "Mật khẩu ít nhất phải dài 6 ký tự !"));
      // return res.status(400).json({ message: "Mật khẩu ít nhất phải dài 6 ký tự !" });
    }

    const check = await UserModel.findOne({ userName: userName });
    if (check) {
      return next(createError(400, "Username đã tồn tại !"));
      // return res.status(400).json({ message: "Username đã tồn tại !" });
    }

    const checkGmail = await UserModel.findOne({ gmail: gmail });
    if (checkGmail) {
      return next(createError(400, "Gmail đã tồn tại !"));
      // return res.status(400).json({ message: "Gmail đã tồn tại !" });
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
    // res.status(500).json({ mess: "server error", error });
  }
};

exports.signIn = async (req, res, next) => {
  try {
    const checkUser = await UserModel.findOne({ gmail: req.body.gmail });
    if (!checkUser) {
      return next(createError(400, "Sai gmail !"));
      // return res.status(400).json("Sai gmail !");
    }

    const checkPassWord = await bcrypt.compare(
      req.body.password,
      checkUser.password
    );
    if (!checkPassWord) {
      return next(createError(400, "Sai password !"));
      // return res.status(400).json("Sai password !");
    }

    // const token = createToken(checkUser._id);

    // res.cookie("chat-app", token, {
    //   httpOnly: true,
    //   expiresIn: JWT_EXPIRED_IN,
    // });
    // console.log(81, req.cookies["chat-app"]);
    const { accessToken, refreshToken } = await generateTokens(checkUser);
    // res.status(200).json({
    //   _id: checkUser._id,
    //   userName: checkUser.userName,
    //   gmail: checkUser.gmail,
    //   avatar: checkUser.avatar,
    //   token,
    //   status: true,
    //   message: "log-in success",
    // });
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
    // res.status(500).json({ mess: "server error", error });
  }
};

exports.getOneUser = async (req, res, next) => {
  try {
    let user = await UserModel.findOne({ _id: req.params.id });
    sendSuccess(res, "Lấy thông tin thành công!", user);
    // res.status(200).json({ mess: "thanh cong", user });
  } catch (error) {
    next(createError(500, error.message));
    // res.status(500).json({ mess: "server error", error });
  }
};

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
    // res.status(500).json({ mess: "server error", error });
  }
};

exports.changeUserPassword = async (req, res, next) => {
  try {
    const checkUser = await UserModel.findOne({ gmail: req.body.gmail });
    if (!checkUser) {
      return next(createError(400, "Sai gmail !"));
      // return res.status(400).json("Sai gmail !");
    }

    const checkPassWord = await bcrypt.compareSync(
      req.body.password,
      checkUser.password
    );
    if (!checkPassWord) {
      return next(createError(400, "Sai password !"));
      // return res.status(400).json("Sai password !");
    }
    const changePass = await UserModel.updateOne(
      { _id: checkUser._id },
      { password: bcrypt.hashSync(req.body.newPassword, 10) }
    );

    // res.status(200).json({ mess: "change password thanh cong", changePass });
    sendSuccess(res, "Đổi mật khẩu thành công !", changePass);
  } catch (error) {
    next(createError(500, error.message));
    // res.status(500).json({ mess: "server error", error });
  }
};

exports.logOut = async (req, res, next) => {
  try {
    res.clearCookie("chat-app");
  } catch (error) {
    res.status(500).json({ mess: "server error", error });
    // logger.error(error);
  }
};

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
    // res.json({ mess: "ok", update });
    sendSuccess(res, "Thay đổi avatar thành công !", update);
  } catch (error) {
    next(createError(500, error.message));
    // res.status(500).json("server error" + error);
  }
};
