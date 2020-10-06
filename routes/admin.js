/**
 * ======== Packages ========
 */
const express = require("express");
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
router.get("/products", isAuth, AdminController.getProducts);

// /admin/add-product
router.get("/add-product", isAuth, AdminController.getAddProduct);
router.post("/add-product", AdminController.postAddProduct);

//  /admin/edit-product
router.get("/edit-product/:productId", isAuth, AdminController.getEditProduct);
router.post("/edit-product", AdminController.postEditProduct);

// /admin/delete-product
router.post("/delete-product", AdminController.postDeleteProduct);

/**
 * ======== End Routes ========
 */

exports.routes = router;
