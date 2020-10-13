/**
 *  =============== Packgae =============
 */
const http = require("http"); // http core module
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const fileUpload = require("express-fileupload");
const MongoDBStore = require("connect-mongodb-session")(session);

/**
 *  =============== End Package =============
 */

// Mongodb Connection
// const mongoConnect = require("./util/database");

/**
 *  =============== Global Variabel =============
 */
const MONGODB_URL =
  process.env.MONGODB_URL || "mongodb://localhost:27017/course";
const port = process.env.PORT || 4000;
const app = express();
// Session nodejs & Mongodb
const storeSession = new MongoDBStore({
  uri: MONGODB_URL,
  collection: "sessions",
});
const csurfProtection = csrf({ cookie: true });
// Multer Configuration
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "/images"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + path.extname(file.originalname));
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
// routes Variable
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
// Model Variable
const User = require("./models/user");
// Controller Variable
const errorController = require("./controllers/error");

/**
 *  =============== Global Variabel =============
 */

/**
 * ========== Initialize all stuf ========
 */
// Initialize Session Express
app.set("view engine", "ejs");
app.set("views", "views");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({
    storage: fileStorage,
    fileFilter: fileFilter,
  }).single("image")
);
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(cookieParser());
app.use(fileUpload());
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: storeSession,
  })
);
// Initialize csrf
app.use(csurfProtection);
// initialize connect-flash
app.use(flash());
// Initialize session of user
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }

  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      throw new Error(err);
    });
});
// Initialize ccsrf &authentication login
app.use((req, res, next) => {
  app.locals.isAuthenticated = req.session.isLoggedIn;
  app.locals.csrfToken = req.csrfToken();
  next();
});

//initialize routes
app.use("/admin", adminRoutes.routes);
app.use(shopRoutes);
app.use(authRoutes);

// Error Routes
app.get("/500", errorController.get500);
app.use(errorController.get404);
// Error Middleware
app.use((error, req, res, next) => {
  res.redirect("/500");
});

/**
 * ========== End Initialize all stuf ========
 */

/**

/**
 *  =============== Connecting to Server & Database =============
 */
mongoose
  .connect(MONGODB_URL)
  .then((result) => {
    http.createServer(app).listen(port);
  })
  .catch((err) => {
    console.log("err :>> ", err);
  });

/**
 *  =============== End Connecting to Server & Database =============
 */
