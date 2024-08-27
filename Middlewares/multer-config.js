const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, "uploads/images");
    } else if (file.mimetype.startsWith("audio")) {
      cb(null, "uploads/audio");
    } else {
      cb(null, "uploads/");
    }
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
