/**
 *  =========== Packages ==============
 */

const bcrypt = require("bcryptjs");

/**
 *  =========== End  Packages =========
 */

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

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({
    email: email,
  })
    .then((user) => {
      if (user) {
        return bcrypt
          .compare(password, user.password)
          .then(async (doMatch) => {
            if (doMatch) {
              req.session.isLoggedIn = true;
              req.session.user = user;
              await req.session.save((err) => {
                console.log("err session :>> ", err);
              });
              return res.redirect("/");
            }
            res.redirect("/login");
          })
          .catch((err) => {
            console.log("err :>> ", err);
            return res.redirect("/login");
          });
      }

      return res.redirect("/login");
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

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  console.log("email :>> ", email);
  console.log("password :>> ", password);

  User.findOne({
    email: email,
  })
    .then((user) => {
      if (user) {
        return res.redirect("/signup");
      }

      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const userData = new User({
            email: email,
            password: hashedPassword,
            cart: {
              items: [],
            },
          });
          return userData.save();
        })
        .then((result) => {
          res.redirect("/login");
        });
    })
    .catch((err) => {
      console.log("err email :>> ", err);
    });
};
