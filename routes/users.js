var express = require("express");
var router = express.Router();
const path = require("path");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const multer = require("multer");
const { JWT_PASSWORD } = process.env;
const {
  getAllUser,
  createNewUser,
  signIn,
  getOneUser,
  changeUserPassword,
  updateProfile,
} = require("../controller/userController");
const { checkLogIn, checkAdmin } = require("../middleware/auth");
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
// route.put('/upload-profile',uploadProfile);//đổi avatar
router.post("/upload", upload.single("avatar"), async function (req, res) {
  try {
    const token = req.cookies["chat-app"];
    const id = jwt.verify(token, JWT_PASSWORD);
    const update = await UserModel.updateOne(
      { _id: id.id },
      { avatar: req.file.filename }
    );
    console.log(56, req.file);
    console.log(57, req.body);
    if (update.modifiedCount === 0) {
      fs.unlinkSync(req.file.filename);
    }
    res.json({ mess: "ok", update });
  } catch (error) {
    res.status(500).json("server error" + error);
  }
});
// router.put("/profile/:id", updateProfile);

module.exports = router;
