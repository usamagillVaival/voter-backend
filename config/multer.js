require("dotenv").config();
const crypto = require("crypto");
const path = require("path");
const { GridFsStorage } = require("multer-gridfs-storage");
const multer = require("multer");

const { DATABASE } = process.env;

var storage = new GridFsStorage({
  // url: DATABASE,
  url: `mongodb+srv://usmavaival:Usama123@cluster0.bvbkb.mongodb.net/Vault?authSource=admin&replicaSet=atlas-13ie0e-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true`,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});
const upload = multer({ storage });
module.exports = { upload };
