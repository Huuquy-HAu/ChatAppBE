const mongoose = require('mongoose')
require('dotenv').config()
const {MONGOOSE_URL} = process.env
mongoose.set('strictQuery', false);
mongoose.connect(MONGOOSE_URL)
  .then(() => console.log('Connected!'));

module.exports = mongoose