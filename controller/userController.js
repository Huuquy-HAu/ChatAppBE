const UserModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { logger } = require("../config/winston");
const { JWT_PASSWORD, JWT_EXPIRED_IN } = process.env;

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, JWT_PASSWORD, {
    expiresIn: maxAge,
  });
};

exports.getAllUser = async (req, res) => {
  try {
    let user = await UserModel.find({ _id: { $ne: req.params.id } });
    res.status(200).json({ mess: "thanh cong", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mess: "server error", error });
  }
};

exports.createNewUser = async (req, res) => {
  try {
    console.log(26, req.body);
    const check = await UserModel.findOne({ userName: req.body.userName });
    if (check) return res.status(400).json({ mess: "username da ton tai" });

    const checkGmail = await UserModel.findOne({ gmail: req.body.gmail });
    if (checkGmail) return res.status(400).json({ mess: "gmail da ton tai" });

    const password = await bcrypt.hash(req.body.password, 10);

    const user = await UserModel.create({
      userName: req.body.userName,
      gmail: req.body.gmail,
      password: password,
    });
    // const token = createToken(user._id);

    // // res.cookie("chat-app", token, { expiresIn: "1d" });
    // res.cookie("chat-app", token, {
    //   withCredentials: true,
    //   httpOnly: false,
    //   maxAge: maxAge * 1000,
    // });
    // console.log(">>> req.cokkies: ", req.cookies);
    // console.log(45, token);
    // console.log(46, req.cookies.chat);
    // res.status(201).json({ user: user._id, created: true });
    delete user._doc.password;
    res.status(200).json({ mess: "creater user success", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mess: "server error", error });
  }
};

exports.signIn = async (req, res) => {
  try {
    const checkUser = await UserModel.findOne({ gmail: req.body.gmail });
    if (!checkUser) return res.status(400).json("wrong gmail");

    const checkPassWord = await bcrypt.compare(
      req.body.password,
      checkUser.password
    );
    if (!checkPassWord) return res.status(400).json("wrong password");

    const token = createToken(checkUser._id);

    res.cookie("chat-app", token, { httpOnly: true, maxAge: maxAge * 1000 });
    console.log(81, req.cookies["chat-app"]);
    res.status(200).json({
      _id: checkUser._id,
      userName: checkUser.userName,
      gmail: checkUser.gmail,
      avatar: checkUser.avatar,
      token,
      status: true,
      mess: "log-in success",
    });
  } catch (error) {
    res.status(500).json({ mess: "server error", error });
  }
};

exports.getOneUser = async (req, res) => {
  try {
    let user = await UserModel.findOne({ _id: req.params.id });
    res.status(200).json({ mess: "thanh cong", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mess: "server error", error });
  }
};

// exports.changeInformation = async(req,res) =>{
//   try {
//     const user = await UserModel.updateOne({userName:req.body.userName})
//   } catch (error) {
//     res.status(500).json({mess:'server error' , error})
//   }
// }

exports.changeUserPassword = async (req, res) => {
  try {
    const checkUser = await UserModel.findOne({ gmail: req.body.gmail });
    if (!checkUser) return res.status(400).json("wrong gmail");

    const checkPassWord = await bcrypt.compareSync(
      req.body.password,
      checkUser.password
    );
    if (!checkPassWord) return res.status(400).json("wrong password");
    const changePass = await UserModel.updateOne(
      { _id: checkUser._id },
      { password: bcrypt.hashSync(req.body.newPassword, 10) }
    );

    res.status(200).json({ mess: "change password thanh cong", changePass });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mess: "server error", error });
  }
};

exports.logOut = async (req, res) => {
  try {
    res.clearCookie("chat-app");
  } catch (error) {
    res.status(500).json({ mess: "server error", error });
    // logger.error(error);
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const token = req.cookies["chat-app"];
    console.log(141, token);
    const id = jwt.verify(token, JWT_PASSWORD);
    console.log(143, id.id);
    console.log(144, req.body);
    const user = await UserModel.findOne({ _id: req.params.id });
    console.log(user);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ mess: "server error", error });
  }
};
