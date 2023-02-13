var express = require("express");
const {
  getAllUser,
  createNewUser,
  signIn,
  getOneUser,
  changeUserPassword,
} = require("../controller/userController");
var router = express.Router();
const { checkLogIn } = require("../middleware/auth");
// const UserModel = require("../models/userModel");

/* GET users listing. */
router.get("/", getAllUser); //get all user chỉ dành cho admin
router.get("/:id", getOneUser); //get one user
router.post("/sign-up", createNewUser); //tạo mới user
router.post("/sign-in", signIn); // đăng nhập
router.put("/:id", changeUserPassword); // đổi mật khẩu

module.exports = router;
