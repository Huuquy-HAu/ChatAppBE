var express = require("express");
const { checkLogin } = require("../middleware/auth");
var router = express.Router();

/* GET home page. */
router.get("/", checkLogin, (req, res) => {
  console.log(">>> console.log file index.js", req.user._id.toString());
  res.json(req.user);
});

router.get("/set-cookie", function (req, res, next) {
  res.cookie("key", "value");
  res.cookie("key2", "value2");
  res.send("set cookie success");
});

router.get("/get-cookie", function (req, res, next) {
  res.send(req.cookies);
});

router.get("/del-cookie", function (req, res, next) {
  res.clearCookie("key2");
  res.send("delete cookie success");
});

module.exports = router;
