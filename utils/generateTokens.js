const jwt = require("jsonwebtoken");
const UserToken = require("../models/userToken");
const {
  ACCESS_TOKEN_PRIVATE_KEY,
  REFRESH_TOKEN_PRIVATE_KEY,
  ACCESS_TOKEN_TIME,
  REFRESH_TOKEN_TIME,
} = process.env;

const generateTokens = async (user) => {
  try {
    const payload = { _id: user._id };
    const accessToken = jwt.sign(payload, ACCESS_TOKEN_PRIVATE_KEY, {
      expiresIn: ACCESS_TOKEN_TIME,
    });

    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_PRIVATE_KEY, {
      expiresIn: REFRESH_TOKEN_TIME,
    });

    const userToken = await UserToken.findOne({ userId: user._id });
    console.log(19, userToken);
    if (userToken) await userToken.remove();

    await new UserToken({
      userId: user._id,
      token: refreshToken,
    }).save();
    return Promise.resolve({ accessToken, refreshToken });
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
};
module.exports = generateTokens;
