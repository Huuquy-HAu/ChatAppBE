require("./config/ultil");
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

const { logger: loggerWinston } = require("./config/winston");

var indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const roomChatRouter = require("./routes/roomchatRoute");
const chatRoute = require("./routes/chatRoute");
const refreshTokenRouter = require("./routes/refreshToken");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use("/", indexRouter);
app.use("/chat", chatRoute);
app.use("/users", usersRouter);
app.use("/api", roomChatRouter);
app.use("/api/refreshToken", refreshTokenRouter);

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // handle the error
  let { status, name, message } = err;
  var caller_line = err.stack.split("\n")[4];
  let logInfo = {
    status,
    name,
    message,
    caller_line,
  };
  loggerWinston.error(logInfo);
  res.status(status || 500);
  res.json({
    status,
    name,
    message: status >= 500 ? "" : message,
  });
});

module.exports = app;
