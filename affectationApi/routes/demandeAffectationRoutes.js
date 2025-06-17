const express = require('express');
const router = express.Router();
const demandeCtrl = require('../controllers/demandeAffectationController');

// Client envoie une demande à un entraîneur
router.post('/envoyer', demandeCtrl.envoyerDemande);

// Entraîneur récupère toutes ses demandes reçues
router.get('/entraineur/:keyEntraineur', demandeCtrl.getDemandesByEntraineur);

router.get('/clientsContact/:keyEntraineur', demandeCtrl.getClientsAffectes);
router.get('/entraineursContact/:keyClient', demandeCtrl.getEntraineursAffectes);
// Entraîneur accepte une demande
router.put('/accepter/:id', demandeCtrl.accepterDemande);

module.exports = router;
