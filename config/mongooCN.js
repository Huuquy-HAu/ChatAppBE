const mongoose = require("mongoose");
require("dotenv").config();
const { MONGOOSE_URL } = process.env;
console.log(4, MONGOOSE_URL);

mongoose.connect(MONGOOSE_URL).then(() => console.log("Connected!"));

module.exports = mongoose;
