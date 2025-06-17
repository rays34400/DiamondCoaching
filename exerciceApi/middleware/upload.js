const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 📂 Crée le dossier s’il n’existe pas
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 🎯 Configuration du stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
    cb(null, uniqueName);
  },
});

// 🎯 Filtrage des types MIME
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'video/mp4',
    'video/mpeg',
    'video/quicktime',
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Fichier non autorisé. Seules les images et vidéos sont acceptées.'));
  }
};

// 📦 Middleware multer pour plusieurs fichiers
const upload = multer({ storage, fileFilter });

module.exports = upload;
