const express = require('express');
const router = express.Router();
const rendezVousController = require('../controllers/rendezVousController');
const authClient = require('../middleware/authClient');
const authEntraineur = require('../middleware/authEntraineur');

router.post('/add', rendezVousController.createRendezVous);
router.get('/client/:keyClient', rendezVousController.getByClient);
router.get('/entraineur/:keyEntraineur', rendezVousController.getByEntraineur);
router.put('/statut/:id', rendezVousController.updateStatut);
router.delete('/delete/:id', rendezVousController.deleteRendezVous);
module.exports = router;
