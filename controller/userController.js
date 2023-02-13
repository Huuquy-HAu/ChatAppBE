const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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
    console.log(25, req.body);
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

    // // res.cookie("chat", token, { expiresIn: "1d" });
    // res.cookie("chat", token, {
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

    // delete checkUser._doc.password;
    // const token = jwt.sign({ checkUser }, JWT_PASSWORD, {
    //   expiresIn: JWT_EXPIRED_IN,
    // });
    // console.log(50, token);
    // res.cookie("chat-user", token, { expires: new Date(Date.now() + 900000) });
    // res.json({ mess: "dang nhap thanh cong", checkUser });
    const token = createToken(checkUser._id);

    res.cookie("chat", token, { httpOnly: true, maxAge: maxAge * 1000 });
    console.log(78, req.cookies.chat);
    res.status(200).json({
      _id: checkUser._id,
      userName: checkUser.userName,
      gmail: checkUser.gmail,
      status: true,
      mess: "log-in success",
      token,
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
    // if (!changePass.matchedCount)
    //   return res.status(400).json({ mess: "wrong gmail" });

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
  }
};
