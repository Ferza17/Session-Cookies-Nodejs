/**
 *  ============ Packages ===============
 */
const fs = require("fs");
const path = require("path");
/**
 *  ============ End Packages ===============
 */
/**
 *  ============ Models ===============
 */
const Product = require("../models/product");
const Cart = require("../models/cart");
const Order = require("../models/order");
const order = require("../models/order");
/**
 *  ============ End Models ===============
 */
// Call Back Functions
exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
        hasProduct: products.length > 0,
        activeShop: true,
        productCSS: true,
      });
    })
    .catch((err) => {});
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: "Product Details",
        path: "/products",
        hasProduct: Product.length > 0,
        activeShop: true,
        productCSS: true,
      });
    })
    .catch((err) => {
      console.log("err getProduct :>> ", err);
    });
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        hasProduct: products.length > 0,
        activeShop: true,
        productCSS: true,
      });
    })
    .catch((err) => {});
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      const products = user.cart.items;
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
      });
    })
    .catch((err) => {});
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((pruduct) => {
      return req.user.addToCart(pruduct);
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {});
};

exports.postCartDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  req.user.removeFromCart(productId);
  res.redirect("/cart");
};

exports.getCheckout = (req, res, next) => {
  res.render({
    path: "/checkout",
    pageTitle: "Checkout",
  });
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
      });
    })
    .catch((err) => {});
};

exports.postOrders = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return {
          quantity: i.quantity,
          product: { ...i.productId._doc },
        };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user,
        },
        products: products,
      });
      return order.save();
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then(() => {
      return res.redirect("/orders");
    })
    .catch((err) => {
      console.log("err :>> ", err);
    });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
    .then((result) => {
      if (!order) {
        return next(new Error("No order Found."));
      }

      if (order.user.userId.toString() == req.user._id.toString()) {
        return next(new Error("~Unaothorized."));
      }

      const invoiceName = "invoice-" + orderId + ".pdf";
      const invoicePath = path.join("data", "invoices", invoiceName);
      fs.readFile(invoicePath, (err, data) => {
        if (err) {
          return next(err);
        }
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "inline");
        res.send(data);
      });
    })
    .catch((err) => {
      next(err);
    });
};
