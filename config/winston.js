// Import the winston library
const winston = require("winston");

// Define the logging options
const options = {
  transports: [
    new winston.transports.File({
      level: "info",
      filename: "./logs/app.log",
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false,
    }),
    new winston.transports.Console({
      level: "debug",
      handleExceptions: true,
      json: false,
      colorize: true,
    }),
  ],
  exitOnError: false,
};

// Create the logger
exports.logger = winston.createLogger(options);

// logger.error(message): ghi lỗi cấp độ cao nhất.
// logger.warn(message): ghi lỗi cấp độ trung bình.
// logger.info(message): ghi thông tin.
// logger.verbose(message): ghi thông tin chi tiết.
// logger.debug(message): ghi thông tin gỡ lỗi.
// logger.silly(message): ghi thông tin vô nghĩa nhất.
