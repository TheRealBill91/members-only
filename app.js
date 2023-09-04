const createError = require("http-errors");
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const flash = require("connect-flash");
const bcrypt = require("bcryptjs");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const favicon = require("serve-favicon");

const passportConfig = require("./controllers/passportController");
const userInViews = require("./middleware/userInViews");
const flashMessageInViews = require("./middleware/flashMessageInViews");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const loginOutRouter = require("./routes/loginOut");
const messageRouter = require("./routes/message");

require("dotenv").config();

const app = express();

app.use(favicon(__dirname + "/favicon.ico"));

app.use(compression()); // Compress all routes

app.use(helmet());

const cookie = {
  httpOnly: true,
};

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
  ttl: 4 * 24 * 60 * 60, // expires after 4 days,
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
    name: "sessionId",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: cookie,
    store: mongoStore,
  })
);
app.use(flash());
passportConfig.passportInitialization(app);

app.use(userInViews);
app.use(flashMessageInViews);
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/", messageRouter);
app.use("/", loginOutRouter);
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
