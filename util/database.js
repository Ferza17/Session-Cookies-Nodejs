const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
  MongoClient.connect("mongodb://localhost:27017/course")
    .then((client) => {
      console.log("result connected :>> ");
      callback(client);
    })
    .catch((err) => {
      console.log("err connection :>> ", err);
    });
};

module.exports = mongoConnect;
