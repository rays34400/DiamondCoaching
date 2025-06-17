const express = require('express');
const router = express.Router();
const ExerciceController = require('../controllers/exerciceController');
const upload = require('../middleware/upload');
const authEntraineur = require('../middleware/authEntraineur');

// Créer un exercice (avec image et vidéo)
router.post(
  '/add',
  authEntraineur,
  upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]),
  ExerciceController.createExercice
);

// Récupérer tous les exercices
router.get('/', ExerciceController.getAllExercices);

// Récupérer les exercices liés à un programme
router.get('/programme/:programmeId', ExerciceController.getExercicesByProgramme);

// Récupérer un exercice par ID
router.get('/:id', ExerciceController.getExerciceById);

// Modifier un exercice
router.put(
  '/modifier/:id',
  authEntraineur,
  upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]),
  ExerciceController.updateExercice
);

// Supprimer un exercice
router.delete('/delete/:id', authEntraineur, ExerciceController.deleteExercice);

module.exports = router;
