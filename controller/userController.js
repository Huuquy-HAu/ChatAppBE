const UserModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { logger } = require("../config/winston");
const { JWT_PASSWORD, JWT_EXPIRED_IN } = process.env;
const createError = require("http-errors");
const MAIL_FORMAT = /^([a-zA-Z0-9_\.\-])+\@gmail.com/;

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
    return next(createError(500, error.message));
  }
};

exports.createNewUser = async (req, res, next) => {
  const userName = req.body.userName;
  const gmail = req.body.gmail;
  const password = req.body.password;
  try {
    if (!userName || !gmail || !password) {
      return next(createError(400, "Không để trống thông tin !"))
    } else if (!MAIL_FORMAT.test(gmail)) {
      return next(createError(400, "Sai định dạng gmail !"))
    } else if (password.length < 6) {
      return next(createError(400, "Mật khẩu ít nhất phải dài 6 ký tự !"))
    }

    const check = await UserModel.findOne({ userName: userName });
    if (check) {
        return next(createError(400, "Username đã tồn tại !"))
    }

    const checkGmail = await UserModel.findOne({ gmail: gmail });
    if (checkGmail){
      return next(createError(400, "Gmail đã tồn tại !"))
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

exports.signIn = async (req, res,next) => {
  try {
    const checkUser = await UserModel.findOne({ gmail: req.body.gmail });
    if (!checkUser){
      return next(createError(400, "Sai gmail !"))
    } 

    const checkPassWord = await bcrypt.compare(
      req.body.password,
      checkUser.password
    );
    if (!checkPassWord){
      return next(createError(400, "Sai password !"))
    } 

    const token = createToken(checkUser._id);

    res.cookie("chat-app", token, {httpOnly: true, expiresIn: JWT_EXPIRED_IN});

    sendSuccess(res, "Log-in success", {
      _id: checkUser._id,
      userName: checkUser.userName,
      gmail: checkUser.gmail,
      avatar: checkUser.avatar,
      token,
    });
  } catch (error) {
    next(createError(500, error.message));
  }
};

exports.getOneUser = async (req, res,next) => {
  try {
    let user = await UserModel.findOne({ _id: req.params.id });
    sendSuccess( res, 'Lấy thông tin thành công!', user )
  } catch (error) {
    next(createError( 500, error.message))
  }
};

exports.changeInformation = async (req, res,next) => {
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
   sendSuccess(res, 'Sửa thông tin người dùng thành công !', user)
  } catch (error) {
    next(createError(500, error.message))
  }
};

exports.changeUserPassword = async (req, res, next) => {
  try {
    const checkUser = await UserModel.findOne({ gmail: req.body.gmail });
    if (!checkUser){
      return next(createError(400, "Sai gmail !"))
    } 

    const checkPassWord = await bcrypt.compareSync(
      req.body.password,
      checkUser.password
    );
    if (!checkPassWord){
      return next(createError(400, "Sai password !"))
    } 
    const changePass = await UserModel.updateOne(
      { _id: checkUser._id },
      { password: bcrypt.hashSync(req.body.newPassword, 10) }
    );

    sendSuccess(res, 'Đổi mật khẩu thành công !', changePass)
  } catch (error) {
    next(createError(500, error.message))
  }
};

exports.logOut = async (req, res, next) => {
  try {
    res.clearCookie("chat-app");
  } catch (error) {
    res.status(500).json({ mess: "server error", error });
  }
};

exports.uploadAvatar = async (req, res, next) => {
  try {
    const token = req.cookies["chat-app"];
    const id = jwt.verify(token, JWT_PASSWORD);
    const update  = await UserModel.updateOne(
      { _id: id.id },
      { avatar: req.file.path }
    );

    if (update.modifiedCount === 0) {update
      fs.unlinkSync(req.file.filename);
    }
    sendSuccess(res, 'Thay đổi avatar thành công !', update)
  } catch (error) {
    next(createError(500, error.message))
  }
};
