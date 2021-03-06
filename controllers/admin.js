/**
 *  ============= Models =============
 */
const Product = require("../models/product");
/**
 *  ============= ENd Models =============
 */
/**
 *  ============= Helper =============
 */
const fileHelper = require("../util/file");
/**
 *  ============= End Helper =============
 */
exports.getAddProduct = (req, res, next) => {
  let message = req.flash("error");
  message.length > 0 ? (message = message[0]) : (message = null);
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    errorMessage: message,
  });
};

exports.postAddProduct = (req, res, next) => {
  let message = req.flash("error");
  const title = req.body.title;
  const image = req.file;
  const price = parseFloat(req.body.price);
  const description = req.body.description;
  const imageUrl = image.path;
  if (!image) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/edit-product",
      editing: true,
      product: {
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        userId: req.user,
      },
      errorMessage: "Attached file is not an image.",
    });
  }
  // For Windows use this
  const imageFilter = imageUrl.split("i").pop().replace("\\", "/");

  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: "http://localhost:4000/i" + imageFilter,
    userId: req.user,
  });
  product
    .save()
    .then((result) => {
      console.log("Created Product");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log("err :>> ", err);
      // const error = new Error(err);
      // err.httpStatusCode = 500;
      // return next(error);
    });
};

exports.getEditProduct = (req, res, next) => {
  let message = req.flash("error");
  message.length > 0 ? (message = message[0]) : (message = null);
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }

  Product.findById(req.params.productId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
        errorMessage: message,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      err.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = parseFloat(req.body.price);
  const image = req.file;
  const updatedDescription = req.body.description;
  const updatedImageUrl = image.path;
  Product.findById(prodId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDescription;
      if (image) {
        fileHelper.deleteFile(product.imageUr);
        product.imageUrl = updatedImageUrl;
      }

      return product.save().then((result) => {
        res.redirect("/");
      });
    })
    .catch((err) => {
      const error = new Error(err);
      err.httpStatusCode = 500;
      return next(error);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId)
    .then((product) => {
      if (!product) {
        return next(new Error("Product Not Found!"));
      }
      fileHelper.deleteFile(product.imageUrl);
      return Product.deleteOne({
        _id: productId,
        userId: req.user._id,
      })
        .then((result) => {
          res.redirect("/admin/products");
        })
        .catch((err) => {
          const error = new Error(err);
          err.httpStatusCode = 500;
          return next(error);
        });
    })
    .catch((err) => next(err));
};

exports.getProducts = (req, res, next) => {
  Product.find({
    userId: req.user._id,
  })
    // .select("title price -_id ")
    // .populate("userId", "name")
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
        hasProduct: products.length > 0,
        activeShop: true,
        productCSS: true,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      err.httpStatusCode = 500;
      return next(error);
    });
};
