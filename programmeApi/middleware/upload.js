const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // max 50 Mo
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|mp4|mov|avi/;
    const isValid = filetypes.test(file.mimetype) && filetypes.test(path.extname(file.originalname).toLowerCase());
    cb(isValid ? null : new Error('Fichier non supporté'), isValid);
  }
});

module.exports = upload;
