const path = require('path');
const express = require("express");
const router = express.Router();

const peoductController = require('../controllers/products');

router.get("/", peoductController.getProducts );

module.exports = router;
