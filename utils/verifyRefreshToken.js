const jwt = require("jsonwebtoken");
const UserToken = require("../models/userToken");
const { REFRESH_TOKEN_PRIVATE_KEY } = process.env;

const verifyRefreshToken = (refreshToken) => {
  const privateKey = REFRESH_TOKEN_PRIVATE_KEY;
  return new Promise((resolve, reject) => {
    UserToken.findOne({ token: refreshToken }, (err, doc) => {
      console.log(999, doc);
      if (!doc)
        return reject({ error: true, message: "Invalid refresh token" });

      jwt.verify(refreshToken, privateKey, (err, tokenDetails) => {
        if (err)
          return reject({ error: true, message: "Invalid refresh token" });
        resolve({
          tokenDetails,
          error: false,
          message: "Valid refresh token",
        });
      });
    });
  });
};
module.exports = verifyRefreshToken;
