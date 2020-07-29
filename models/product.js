const fs = require("fs");
const path = require("path");

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
    this.price = price;
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

  static fetchAll(cb) {
    return getProductsFromFIle(cb);
  }

  static findById(id, cb) {
    getProductsFromFIle((products) => {
      return cb(products.find((p) => p.id === id));
    });
  }
};
