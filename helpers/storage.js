const multer = require('multer');
const path = require('path');

// Multer setup for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Uploads will be stored in the 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // File name will be appended with current timestamp
  }
});

// Create a Multer instance
const upload = multer({ storage: storage });

module.exports = upload;