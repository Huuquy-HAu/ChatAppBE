const express = require("express");
const UserToken = require("../models/userToken");
const jwt = require("jsonwebtoken");
const verifyRefreshToken = require("../utils/verifyRefreshToken");
const { ACCESS_TOKEN_PRIVATE_KEY, ACCESS_TOKEN_TIME } = process.env;
const { refreshTokenBodyValidation } = require("../utils/validationSchema");
const router = express.Router();

// tạo mới accessToken
// router.post("/", async (req, res) => {
//   const { error } = refreshTokenBodyValidation(req.body);
//   if (error)
//     return res
//       .status(400)
//       .json({ error: true, message: error.details[0].message });

//   verifyRefreshToken(req.body.refreshToken)
//     .then(({ tokenDetails }) => {
//       const payload = { _id: tokenDetails._id };
//       const accessToken = jwt.sign(payload, ACCESS_TOKEN_PRIVATE_KEY, {
//         expiresIn: ACCESS_TOKEN_TIME,
//       });
//       res.status(200).json({
//         error: false,
//         accessToken,
//         message: "Create accessToken success!",
//       });
//     })
//     .catch((err) => res.status(400).json(err));
// });
//log out
// router.delete("/", async (req, res) => {
//   try {
//     const { error } = refreshTokenBodyValidation(req.body);
//     if (error)
//       return res
//         .status(400)
//         .json({ error: true, message: error.details[0].message });

//     const userToken = await UserToken.findOne({ token: req.body.refreshToken });
//     if (!userToken)
//       return res
//         .status(200)
//         .json({ error: false, message: "Đăng xuất thành công!" });

//     await userToken.remove();
//     res.status(200).json({ error: false, message: "Đăng xuất thành công!" });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: true, message: "Internal Server Error" });
//   }
// });
module.exports = router;
