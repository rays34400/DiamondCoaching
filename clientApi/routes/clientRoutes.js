const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const upload = require('../middleware/upload');
const auth = require('../middleware/authClient');

// Inscription (avec ou sans image de profil)
router.post('/register', upload.single('photoProfile'), clientController.registerClient);

// Connexion
router.post('/login', clientController.loginClient);
// Récupérer un client par son nom
router.get('/byname/:nom', auth, clientController.getClientByName);
router.get('/key', auth, clientController.getKeyClientByToken);
router.get('/bykey/:keyClient', clientController.getClientByKey);

router.get('/key/:id', clientController.getKeyClientById);

// Accès au profil client (protégé par token uniquement)
router.get('/:id', auth, clientController.getClientById);

// Modifier les infos du client
router.put('/update/:id', auth, clientController.updateClient);

// Modifier la photo de profil
router.put('/update-photo/:id', auth, upload.single('photoProfile'), clientController.updatePhotoProfile);

// Supprimer le compte
router.delete('/delete/:id', auth, clientController.deleteClient);

module.exports = router;
