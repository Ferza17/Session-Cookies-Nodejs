/**
 *  ========== Globar Variable ================
 */
const express = require("express");
const router = express.Router();
const { check, body } = require("express-validator/check");
/**
 *  ========== End Globar Variable ================
 */
/**
 * ============ Models ============
 */
const User = require("../models/user");

/**
 * ============ End Models ============
 */
/**
 *  ========== Controller ================
 */
const authController = require("../controllers/auth");
/**
 *  ========== End Controller =============
 */
/**
 *  ========== Routes ================
 */

// Login
router.get("/login", authController.getLogin);
router.post(
  "/login",
  [
    check("email").isEmail().withMessage("Please enter a valid email."),
    body(
      "password",
      "Please enter a password with only numbers and text and at least 5 characters."
    )
      .isLength({ min: 5 })
      .isAlphanumeric(),
  ],
  authController.postLogin
);
//Logout
router.post("/logout", authController.postLogout);
// Sign
router.get("/signup", authController.getSignup);
router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        // if (value === "test@test.com") {
        //   throw new Error("this email address is forbidden!");
        // }
        // return true;
        return User.findOne({
          email: value,
        }).then((user) => {
          if (user) {
            return Promise.reject(
              "Email Already Exists already, please pick a different one."
            );
          }
        });
      }),
    body(
      "password",
      "Please enter a password with only numbers and text and at least 5 characters."
    )
      .isLength({ min: 5 })
      .isAlphanumeric(),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password have to match!");
      }
      return true;
    }),
  ],
  authController.postSignup
);
// Reset
router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);
router.get("/reset/:token", authController.getNewPassword);
router.post("/new-password", authController.postNewPassword);
/**
 *  ========== End Routes ================
 */
module.exports = router;
