const Exercice = require('../models/Exercice');

exports.createExercice = async (req, res) => {
  try {
    const { nom, description, note, programmeId } = req.body;

    if (!nom || !programmeId) {
      return res.status(400).json({ message: 'Le nom et le programmeId sont requis.' });
    }

    let image = '';
    let video = '';

    if (req.files) {
      if (req.files.image && req.files.image[0]) {
        image = req.files.image[0].filename;
      }
      if (req.files.video && req.files.video[0]) {
        video = req.files.video[0].filename;
      }
    }

    const nouvelExercice = new Exercice({
      nom,
      description,
      note,
      programmeId,
      image,
      video,
    });

    await nouvelExercice.save();
    res.status(201).json({ message: 'Exercice créé avec succès.', exercice: nouvelExercice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la création de l\'exercice.', error });
  }
};

exports.getAllExercices = async (req, res) => {
  try {
    const exercices = await Exercice.find();
    res.status(200).json(exercices);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des exercices.', error });
  }
};

exports.getExercicesByProgramme = async (req, res) => {
  try {
    const { programmeId } = req.params;
    const exercices = await Exercice.find({ programmeId });
    res.status(200).json(exercices);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération.', error });
  }
};

exports.deleteExercice = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Exercice.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Exercice introuvable.' });
    res.status(200).json({ message: 'Exercice supprimé.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression.', error });
  }
};

// 🔍 Récupérer un exercice par son ID
exports.getExerciceById = async (req, res) => {
  try {
    const { id } = req.params;
    const exercice = await Exercice.findById(id);
    if (!exercice) {
      return res.status(404).json({ message: "Exercice non trouvé." });
    }
    res.status(200).json(exercice);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération de l'exercice.", error });
  }
};

// 🛠 Modifier un exercice
exports.updateExercice = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, description, note } = req.body;

    const updateData = { nom, description, note };

    // Gestion des fichiers image et vidéo si mis à jour
    if (req.files?.image) {
      updateData.image = req.files.image[0].filename;
    }

    if (req.files?.video) {
      updateData.video = req.files.video[0].filename;
    }

    const updatedExercice = await Exercice.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedExercice) {
      return res.status(404).json({ message: 'Exercice non trouvé.' });
    }

    res.status(200).json({ message: 'Exercice mis à jour avec succès.', exercice: updatedExercice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la mise à jour de l'exercice.", error });
  }
};