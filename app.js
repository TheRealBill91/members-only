const createError = require("http-errors");
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
var bcrypt = require("bcryptjs");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const passportConfig = require("./controllers/passportController");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

require("dotenv").config();

const app = express();

const cookie = {};

// security option for mongo store
const crypto = {
  secret: false,
};

if (app.get("env") === "production") {
  app.set("trust proxy", 1);
  (cookie.secure = true), (crypto.secret = process.env.CRYPTO_SECRET);
}

// Set up mongoose connection
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = process.env.MONGODB_URI || process.env.DEV_DB_URI;

const mongoStore = MongoStore.create({
  mongoUrl: mongoDB,
  ttl: 7 * 24 * 60 * 60, // expires after 7 days,
  touchAfter: 24 * 3600, // only update session once per 24 hours (besides session data changing)
  collectionName: "sessions",
  crypto: crypto,
});

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: cookie,
    store: mongoStore,
  })
);
passportConfig.passportInitialization(app);
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
