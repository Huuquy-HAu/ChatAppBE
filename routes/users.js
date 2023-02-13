var express = require("express");
var router = express.Router();
const {
  getAllUser,
  createNewUser,
  logIn,
  getOneUser,
  changeUserPassword,
} = require("../controller/userController");
const { checkLogIn } = require("../middleware/auth");
// const UserModel = require("../models/userModel");

/* GET users listing. */
router.get("/", getAllUser);

router.get("/:id", getOneUser);

router.post("/sign-up", createNewUser);

router.post("/sign-in", logIn);

router.put("/change-password", changeUserPassword);

module.exports = router;
