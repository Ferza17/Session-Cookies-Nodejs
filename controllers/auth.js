/**
 *  =========== Packages ==============
 */
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodeemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

/**
 *  =========== End  Packages =========
 */

/**
 *  =========== Models ==============
 */

const User = require("../models/user");
const { use } = require("../routes/auth");
/**
 *  =========== End Models ==============
 */
/**
 *  =========== Global Variabel ==============
 */
const transporter = nodeemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: "Yourkey",
    },
  })
);
/**
 *  =========== End Global Variabel ==============
 */

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  message.length > 0 ? (message = message[0]) : (message = null);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message,
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
            req.flash("error", "Invalid email or password.");
            res.redirect("/login");
          })
          .catch((err) => {
            console.log("err :>> ", err);
            req.flash("error", "Invalid email or password.");
            return res.redirect("/login");
          });
      }
      req.flash("error", "Invalid email or password.");
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
  let message = req.flash("error");
  message.length > 0 ? (message = message[0]) : (message = null);
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message,
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  User.findOne({
    email: email,
  })
    .then((user) => {
      if (user) {
        req.flash(
          "error",
          "E-Mail exists already, please pick a different one !."
        );
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
          /**
           * Sending Email, uncomment if u want to implement this code
           */
          // res.redirect("/login");
          // return transporter
          //   .sendMail({
          //     to: email,
          //     from: "youremail@email.com",
          //     subject: "Signup Succeeded!",
          //     html: "<h1>You Successfully signed up!</h1>",
          //   })
          //   .then((result) => {})
          //   .catch((err) => {});

          /**
           * End Sending Email
           */
          res.redirect("/login");
        });
    })
    .catch((err) => {
      console.log("err email :>> ", err);
    });
};

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  message.length > 0 ? (message = message[0]) : (message = null);
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: message,
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, async (err, buffer) => {
    if (err) {
      console.log("err :>> ", err);
      return redirect("/");
    }
    const token = buffer.toString("hex");
    await User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with that email found.");
          return res.redirect("/reset");
        }

        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        /**
         *  ==== Sending email with transpoter ===
         */
        // res.redirect("/");
        //  transporter
        //   .sendMail({
        //     to: email,
        //     from: "youremail@email.com",
        //     subject: "Password Reset.",
        //     html: `
        // <p>You Requested a password Reset</p>
        // <p>Click this <a href="http://localhost:4000/reset/${token}" >Link</a>to set a new Password.</p>
        // `,
        //   })
        //   .then((result) => {})
        //   .catch((err) => {});
        /**
         *  ==== End Sending email with transpoter ===
         */

        res.redirect("/reset/" + token);
      })
      .catch((err) => {
        console.log("err :>> ", err);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({
    resetToken: token,
    resetTokenExpiration: {
      $gt: Date.now(),
    },
  })
    .then((user) => {
      let message = req.flash("error");
      message.length > 0 ? (message = message[0]) : (message = null);
      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "Update Password",
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((err) => {});
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      resetUser = user;
      return (user.password = bcrypt.hash(newPassword, 12));
    })
    .then((hashPassword) => {
      resetUser.password = hashPassword;
      resetUser.resetToken = null;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then((result) => {
      res.redirect("/login");
    })
    .catch((err) => {
      console.log("err :>> ", err);
    });
};
