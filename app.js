/**
 *  =============== Packgae =============
 */
const http = require("http"); // http core module
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
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
/**
 *  =============== Global Variabel =============
 */

/**
 *  =============== Routes =============
 */
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

/**
 *  =============== END Routes =============
 */

/**
 *  =============== Models  App =============
 */
const User = require("./models/user");
/**
 *  =============== End Models  App =============
 */

/**
 *  =============== Controller  App =============
 */
const errorController = require("./controllers/error");
/**
 *  =============== End Controller  App =============
 */

/**
 *  =============== Express  App =============
 */
app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
// Initialize Session Express
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: storeSession,
  })
);

//Routes
app.use("/admin", adminRoutes.routes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

/**
 *  =============== End Express  App =============
 */

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
