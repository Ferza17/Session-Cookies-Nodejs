/**
 * ======== Packages ========
 */
const express = require("express");
const { check, body } = require("express-validator/check");
const multer = require("multer");

/**
 * ========  End Packages ========
 */
/**
 * ======== Middleware ========
 */
const isAuth = require("../middleware/is-auth");
/**
 * ========  End Middleware =====
 */

/**
 * ======== Controller ========
 */
const AdminController = require("../controllers/admin");

/**
 * ======== End Controller ======
 */

/**
 * ======== Global Variable =====
 */
const router = express.Router();
/**
 * ======= End Global Variable ===
 */

/**
 * ======== Routes ========
 */

// /admin/products
router.get(
  "/products",
  isAuth,

  AdminController.getProducts
);

// /admin/add-product
router.get(
  "/add-product",
  isAuth,
  [
    body("title").isString().isLength({ min: 3 }).trim(),
    body("price").isFloat(),
    body("description").isLength({ min: 5, max: 400 }).trim(),
  ],
  AdminController.getAddProduct
);
router.post("/add-product", AdminController.postAddProduct);

//  /admin/edit-product
router.get("/edit-product/:productId", isAuth, AdminController.getEditProduct);
router.post("/edit-product", AdminController.postEditProduct);

// /admin/delete-product
// router.post("/delete-product", AdminController.postDeleteProduct);
router.delete("/product/:productId", isAuth, AdminController.deleteProduct);

/**
 * ======== End Routes ========
 */

exports.routes = router;
