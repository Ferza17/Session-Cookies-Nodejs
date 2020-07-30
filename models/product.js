const fs = require("fs");
const path = require("path");

const Cart = require("./cart");
const { json } = require("body-parser");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "products.json"
);

const getProductsFromFIle = async (cb) => {
  await fs.readFile(p, (err, fileContent) => {
    if (err) {
      return cb([]);
    } else {
      return cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageURL, price, description) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageURL;
    this.price = parseFloat(price, 2);
    this.description = description;
  }

  save() {
    getProductsFromFIle((products) => {
      if (this.id) {
        const existingProduct = products.findIndex(
          (prod) => prod.id === this.id
        );
        const updatedProduct = [...products];
        updatedProduct[existingProduct] = this;
        fs.writeFile(p, JSON.stringify(updatedProduct), (err) => {
          console.log(err);
        });
      } else {
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), (err) => {
          console.log(err);
        });
      }
    });
  }

  static deleteById(id) {
    getProductsFromFIle((products) => {
      const product = products.find((prod) => prod.id === id);
      const updatedProducts = products.filter((prod) => prod.id !== id);
      fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
        if (!err) {
          Cart.deleteProduct(id, product.price);
        }
      });
    });
  }

  static fetchAll(cb) {
    return getProductsFromFIle(cb);
  }

  static findById(id, cb) {
    getProductsFromFIle((products) => {
      return cb(products.find((p) => p.id === id));
    });
  }
};
