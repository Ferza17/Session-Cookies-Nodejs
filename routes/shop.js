/**
 * ========= Packages ============
 */
const express = require("express");
/**
 * ========= End Packages ============
 */

/**
 * ========= Middleware ============
 */
const isAuth = require("../middleware/is-auth");
/**
 * ========= End Middleware ============
 */

/**
 * ========= Global Variable ============
 */
const router = express.Router();
/**
 * ========= End Variable ============
 */

/**
 * ========= Controllers ============
 */
const shopController = require("../controllers/shop");
/**
 * ========= End Controllers ============
 */

/**
 * ========= Routes ============
 */
router.get("/", shopController.getIndex);

router.get("/orders", isAuth, shopController.getOrders);

router.get("/products", shopController.getProducts);

router.get("/products/:productId", isAuth, shopController.getProduct);

router.get("/cart", isAuth, shopController.getCart);

router.post("/cart-delete-item", isAuth, shopController.postCartDeleteProduct);

router.post("/cart", isAuth, shopController.postCart);

router.get("/checkout", isAuth, shopController.getCheckout);

router.post("/create-order", isAuth, shopController.postOrders);

/**
 * ========= End Routes ============
 */
module.exports = router;
