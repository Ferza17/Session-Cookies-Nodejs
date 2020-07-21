const Product = require("../models/product");

// Call Back Functions
exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      prods: products,
      pageTitle : "All Products",
      path: "/products",
      hasProduct: products.length > 0,
      activeShop: true,
      productCSS: true,
    });
  });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/index", {
      prods: products,
      pageTitle : "Shop",
      path: "/",
      hasProduct: products.length > 0,
      activeShop: true,
      productCSS: true,
    });
  });
};

exports.getCart = (req, res, next) => {
  res.render("shop/cart", {
    path: "/cart",
    pageTitle : "Your Cart",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render({
    path: "/checkout",
    pageTitle : "Checkout",
  });
};
