var express = require("express");
var router = express.Router();
const path = require("path");
const {
  getAllUser,
  createNewUser,
  signIn,
  getOneUser,
  changeUserPassword,
  updateProfile,
} = require("../controller/userController");
const { checkLogIn } = require("../middleware/auth");
// const UserModel = require("../models/userModel");
const multer = require("multer");
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
router.post("/upload/:id", upload.single("avatar"), async function (req, res) {
  try {
    const update = await UserModel.findOne(
      { _id: req.body.id }
      // { avatar: req.file.filename }
    );
    console.log(44, req.file.filename);
    console.log(45, req.body);
    res.json({ mess: "ok", update });
  } catch (error) {
    res.status(500).json("server error" + error);
  }
});
// router.put("/profile/:id", updateProfile);

module.exports = router;
