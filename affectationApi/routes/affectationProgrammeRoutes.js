const express = require('express');
const router = express.Router();
const affectationCtrl = require('../controllers/affectationProgrammeController');

// Entraîneur affecte un programme à un client
router.post('/affecter', affectationCtrl.affecterProgramme);

// Récupérer les programmes affectés à un client
router.get('/programmesClientComplet/:keyClient', affectationCtrl.getProgrammesPourClientComplet);

// Récupérer les programmes affectés par un entraîneur
router.get('/entraineur/:key', affectationCtrl.getProgrammesPourEntraineur);

module.exports = router;
