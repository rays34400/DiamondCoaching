const express = require('express');
const router = express.Router();
const programmeController = require('../controllers/programmeController');
const { verifyToken, authorizeRole } = require('../middleware/authEntraineur');

// Ajouter un programme (réservé aux entraîneurs)
router.post('/add', verifyToken, authorizeRole('entraineur'), programmeController.createProgramme);

// Récupérer les programmes d’un entraîneur (publique ou sécurisé si nécessaire)
router.get('/entraineur/:key', programmeController.getProgrammesByEntraineur);

// Modifier un programme (réservé aux entraîneurs)
router.put('/modifier/:id', verifyToken, authorizeRole('entraineur'), programmeController.modifierProgramme);

// Supprimer un programme (réservé aux entraîneurs)
router.delete('/delete/:id', verifyToken, authorizeRole('entraineur'), programmeController.supprimerProgramme);

router.get('/:id', programmeController.getProgrammeById);

module.exports = router;
