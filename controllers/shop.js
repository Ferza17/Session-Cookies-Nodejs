const Product = require("../models/product");
const Cart = require("../models/cart");
const Order = require("../models/order");

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
      console.log(" user.cart.items :>> ", user.cart.items);
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
          name: req.user.name,
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
