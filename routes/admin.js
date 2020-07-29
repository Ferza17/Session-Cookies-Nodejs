const express = require("express");
const path = require("path");
const router = express.Router();

const AdminController = require("../controllers/admin");

// /admin/products
router.get("/products", AdminController.getProducts);

// /admin/add-product
router.post("/add-product", AdminController.postAddProduct);
router.get("/add-product", AdminController.getAddProduct);

//  /admin/edit-product
router.get("/edit-product/:productId", AdminController.getEditProduct);

exports.routes = router;
