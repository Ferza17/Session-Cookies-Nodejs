const fs = require("fs");
const path = require("path");

const deleteFile = (filePath) => {
  const fileNameFilter = filePath.replace("http://localhost:4000", "");
  fs.unlink(path.join(__dirname, "../" + fileNameFilter), (err) => {
    if (err) {
      throw err;
    }
  });
};

exports.deleteFile = deleteFile;
