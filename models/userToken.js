const { Schema } = require("mongoose");
const mongoose = require("../config/mongooCN");

const UserTokenSchema = mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    createAt: {
      type: Date,
      default: Date.now,
      expires: 30 * 86400, //30 ngày
    },
  },
  { collection: "UserToken" }
);

const UserToken = mongoose.model("UserToken", UserTokenSchema);
module.exports = UserToken;
