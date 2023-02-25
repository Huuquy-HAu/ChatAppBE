var express = require("express");
var router = express.Router();
const path = require("path");
const multer = require("multer");
const {
  getAllUser,
  createNewUser,
  signIn,
  getOneUser,
  changeUserPassword,
  uploadAvatar,
  changeInformation,
  createAccessToken,
  logOut,
} = require("../controller/userController");
const { checkLogIn, checkAdmin, checkAuth } = require("../middleware/auth");
// const UserModel = require("../models/userModel");

const UserModel = require("../models/userModel");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const extname = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + extname);
  },
});
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.includes("image")) {
      if (file.size / 1024 > 200) {
        return cb(new Error("file tải lên định dạng quá lớn"));
      }
      cb(null, true);
    } else {
      cb(new Error("only img không phải định dạng ảnh"));
    }
  },
});
/* GET users listing. */
router.get("/", getAllUser); //get all user chỉ dành cho admin
router.get("/:id", getOneUser); //get one user
router.post("/sign-up", createNewUser); //tạo mới user
router.post("/sign-in", signIn); // đăng nhập
router.put("/:id", changeUserPassword); // đổi mật khẩu
router.post("/upload", upload.single("avatar"), uploadAvatar); //đổi avatar
router.put("/changeInfomation", changeInformation); //chỉnh sửa thông tin cá nhân
router.post("/create-access-token", createAccessToken); //tạo mới accessToken
router.delete("/logout", logOut); //đăng xuất

module.exports = router;
