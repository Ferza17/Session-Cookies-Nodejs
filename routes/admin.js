const express = require("express");
const path = require("path");
const router = express.Router();

const ProductsController = require('../controllers/products');



//  /admin/add-product
router.get("/add-product", ProductsController.getAddProduct);

// /admin/add-product
router.post("/add-product", ProductsController.postAddProduct);

exports.routes = router;
