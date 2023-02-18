const mongoose = require("../config/mongooCN");

const UserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      unique: true,
      required: true,
    },
    gmail: {
      type: String,
      unique: true,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://class.nodemy.vn/api/public/images/logo.png?1675910771501",
    },
    password: {
      type: String,
      unique: true,
      required: true,
    },
    role: {
      type: String,
      default: "2",
      // 0 = banner , 1 = Chưa xác nhận , 2 = User , 3 =  subAdmin, 4 = Admin
    },
    listFriend: [
      {
        type: String,
      },
    ],
    address: {
      type: String,
      default: "",
    },
    phoneNumber: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      default: "",
    },
  },
  { collection: "User" }
);

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
