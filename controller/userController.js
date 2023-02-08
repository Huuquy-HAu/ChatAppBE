const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_PASSWORD, JWT_EXPIRED_IN } = process.env;

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
    // console.log(5, req.body);
    const check = await UserModel.findOne({ userName: req.body.userName });
    if (check) return res.status(400).json({ mess: "username da ton tai" });
    const password = bcrypt.hashSync(req.body.password, 10);
    const user = await UserModel.create({
      userName: req.body.userName,
      gmail: req.body.gmail,
      password: password,
    });
    res.status(200).json({ mess: "creater user success", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mess: "server error", error });
  }
};

exports.logIn = async (req, res) => {
  try {
    const checkUser = await UserModel.findOne({ gmail: req.body.gmail });
    if (!checkUser) return res.status(400).json("wrong gmail");

    const checkPassWord = await bcrypt.compareSync(
      req.body.password,
      checkUser.password
    );
    if (!checkPassWord) return res.status(400).json("wrong password");

    delete checkUser._doc.password;
    const token = jwt.sign({ checkUser }, JWT_PASSWORD, {
      expiresIn: JWT_EXPIRED_IN,
    });
    console.log(46, token);
    res.cookie("chat-user", token, { expires: new Date(Date.now() + 900000) });
    res.json({ mess: "dang nhap thanh cong", checkUser });
  } catch (error) {
    console.log(error);
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
    // console.log(79, req.body);
    // const checkUser = await UserModel.findOne({ gmail: req.body.gmail });
    // if (!checkUser) return res.status(400).json("wrong gmail");
    // console.log(82, checkUser);

    // const checkPassWord = await bcrypt.compareSync(
    //   req.body.password,
    //   checkUser.password
    // );
    // if (!checkPassWord) return res.status(400).json("wrong password");
    const changePass = await UserModel.updateOne(
      { gmail: req.body.gmail },
      { password: bcrypt.hashSync(req.body.newPassword, 10) }
    );
    if (!changePass.matchedCount)
      return res.status(400).json({ mess: "wrong gmail" });
    res.status(200).json({ mess: "change pass thanh cong", changePass });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mess: "server error", error });
  }
};
