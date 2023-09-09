const multer = require("multer");
const path = require("path");

const updatePath = path.join(process.cwd(), "tmp");

const storage = multer.diskStorage({
  destination: (_, __, callback) => {
    callback(null, updatePath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

module.exports = upload;
