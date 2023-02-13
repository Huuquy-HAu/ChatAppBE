// const UserModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { JWT_PASSWORD, JWT_EXPIRED_IN } = process.env;

// const cookieUser =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaGVja1VzZXIiOnsiX2lkIjoiNjNlMzBlZTM1MTdhOWZmNmM3NjIyZTM4IiwidXNlck5hbWUiOiJhbiIsImdtYWlsIjoiYW4iLCJyb2xlIjoiMiIsImxpc3RGcmllbmQiOltdLCJfX3YiOjB9LCJpYXQiOjE2NzU4MjUxNDEsImV4cCI6MTY3NTkxMTU0MX0.NN3BA_WO9gyyWig5LbSp7g6Pkh0AXF6SkB24hQs8zMg";
// let data = jwt.verify(cookieUser, "chat");
// console.log(10, data);

exports.checkLogin = async (req, res, next) => {
  const cookieUser = req.cookies["chat-user"];
  if (!cookieUser) {
    //     res.status(400).json({ mess: "chua dang nhap" });
    return res
      .status(400)
      .json({ mess: "chua dang nhap" })      
  }
  try {
    let data = jwt.verify(cookieUser, JWT_PASSWORD);
    console.log(10, data);
    if (!data) {
      res.status(500).json('error')
    }
    req.user = data.checkUser;
    next();
  } catch (error) {
    console.log(error);
    return res.redirect("/sign-in");
  }
  //   try {
  //     const cookieUser = req.cookies["app-user"];
  //     console.log(20, cookieUser);
  //     if (!cookieUser) return res.redirect("/sign-in");
  //     const checkUser = await UserModel.findOne({ _id: cookieUser });
  //     if (!checkUser) return res.redirect("/sign-in");
  //     req.user = checkUser;
  //     next();
  //   } catch (error) {
  //     console.log(error);
  //   }
};

// exports.checkAdmin = async (req, res, next) => {
//   if (req.user.role !== "4") return res.redirect("/sign-in");
//   next();
// };
