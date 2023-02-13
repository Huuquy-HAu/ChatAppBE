const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");
const { JWT_PASSWORD, JWT_EXPIRED_IN } = process.env;

exports.checkLogin = async (req, res, next) => {
  const token = req.cookies["chat-app"];
  console.log(77777777, token);
  if (token) {
    jwt.verify(token, JWT_PASSWORD, async (err, decodedToken) => {
      if (err) {
        res.redirect("/sign-in");
      } else {
        const user = await UserModel.findOne({ _id: decodedToken.id });
        if (user) res.json({ status: true, user: user.gmail });
        next();
      }
    });
  } else {
    res.redirect("/sign-in");
  }
};
// const token =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZTMwZWUzNTE3YTlmZjZjNzYyMmUzOCIsImlhdCI6MTY3NjI2NzczOCwiZXhwIjoxNjc2NTI2OTM4fQ.HG5LeE96tad8Rbd7rTn3ImIg-xKMUVOJ0O-q0y2tdRg";
// const check = jwt.verify(token, JWT_PASSWORD);
// console.log(233333333333, check);
exports.checkAdmin = async (req, res, next) => {
  if (req.user.role !== "4") return res.redirect("/sign-in");
  next();
};
