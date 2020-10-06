/**
 *  =========== Models ==============
 */

const User = require("../models/user");
/**
 *  =========== End Models ==============
 */

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};

exports.postLogin = async (req, res, next) => {
  console.log("req.body :>> ", req.body);
  await User.findOne({
    email: req.body.email,
    password: req.body.password,
  })
    .then((user) => {
      if (user) {
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save((err) => {
          console.log("err :>> ", err);
        });
      }
      res.redirect("/");
    })
    .catch((err) => {});
};

exports.postLogout = async (req, res, next) => {
  await req.session.destroy((err) => {
    console.log("err :>> ", err);
    res.redirect("/");
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
  });
};

exports.postSignup = (req, res, next) => {};
