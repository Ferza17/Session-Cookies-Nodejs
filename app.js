const http = require("http"); // http core module
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

const mongoose = require("mongoose");

// Mongodb Connection
// const mongoConnect = require("./util/database");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const errorController = require("./controllers/error");

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

//Routes
app.use("/admin", adminRoutes.routes);
app.use(shopRoutes);

app.use(errorController.get404);

const port = process.env.PORT || 4000;

mongoose
  .connect("mongodb://localhost:27017/course")
  .then((result) => {
    console.log(result);
    http.createServer(app).listen(port);
  })
  .catch((err) => {
    console.log("err :>> ", err);
  });
