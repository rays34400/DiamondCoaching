const express = require('express');
const router = express.Router();
const entraineurController = require('../controllers/entraineurController');
const upload = require('../middleware/upload');
const auth = require('../middleware/authEntraineur');

// ✅ Inscription (image en option)
router.post(
  '/register',
  upload.single('photoProfile'),
  entraineurController.registerEntraineur
);

// ✅ Connexion
router.post('/login', entraineurController.loginEntraineur);

// 📍 Route pour récupérer tous les entraîneurs
router.get('/all', entraineurController.getAllEntraineurs);

router.get('/byname/:nom', auth, entraineurController.getEntraineurByName);

router.put('/disponibilites/:keyEntraineur', entraineurController.updateDisponibilites);

router.get('/bykey/:keyEntraineur', entraineurController.getEntraineurByKey);

// ✅ Voir son profil
router.get('/:id', auth, entraineurController.getEntraineurById);

// ✅ Modifier ses infos (sans photo)
router.put('/update/:id', auth, entraineurController.updateEntraineur);

// ✅ Modifier la photo de profil
router.put(
  '/update-photo/:id',
  auth,
  upload.single('photoProfile'),
  entraineurController.updatePhotoProfile
);

// ✅ Supprimer son compte
router.delete('/delete/:id', auth, entraineurController.deleteEntraineur);



module.exports = router;
