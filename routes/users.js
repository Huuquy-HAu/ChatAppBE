var express = require("express");
var router = express.Router();
const {
  getAllUser,
  createNewUser,
  signIn,
  getOneUser,
  changeUserPassword,
} = require("../controller/userController");
const { checkLogIn } = require("../middleware/auth");
// const UserModel = require("../models/userModel");

/* GET users listing. */
router.get("/", getAllUser); //get all user chỉ dành cho admin
router.get("/:id", getOneUser); //get one user
router.post("/sign-up", createNewUser); //tạo mới user
router.post("/sign-in", signIn); // đăng nhập
router.put("/:id", changeUserPassword); // đổi mật khẩu

module.exports = router;
