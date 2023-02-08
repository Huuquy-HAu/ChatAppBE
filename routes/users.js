var express = require("express");
const {
  getAllUser,
  createNewUser,
  logIn,
  getOneUser,
  changeUserPassword,
} = require("../controller/userController");
var router = express.Router();
const { checkLogIn } = require("../middleware/auth");
// const UserModel = require("../models/userModel");

/* GET users listing. */
router.get("/get-all-user", getAllUser);
router.get("/get-one-user/:id", getOneUser);
router.post("/sign-up", createNewUser);
router.post("/sign-in", logIn);
router.put("/change-password", changeUserPassword);

module.exports = router;
