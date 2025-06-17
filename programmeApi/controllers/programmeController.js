const Programme = require('../models/Programme');

// Ajouter un programme
exports.createProgramme = async (req, res) => {
  try {
    const { nom, niveau, objectif, description, keyEntraineur } = req.body;

    // Vérification de tous les champs requis
    if (!nom || !niveau || !objectif || !keyEntraineur) {
      return res.status(400).json({ message: "Tous les champs requis ne sont pas fournis." });
    }

    // Création du nouveau programme
    const nouveauProgramme = new Programme({
      nom,
      niveau,
      objectif,
      description: description || '',
      keyEntraineur
    });

    await nouveauProgramme.save();

    res.status(201).json({
      message: "Programme créé avec succès.",
      programme: nouveauProgramme
    });

  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création du programme.", error });
  }
};

// Récupérer un programme par son ID
exports.getProgrammeById = async (req, res) => {
  try {
    const programme = await Programme.findById(req.params.id);
    if (!programme) {
      return res.status(404).json({ message: "Programme introuvable" });
    }
    res.json(programme);
  } catch (err) {
    console.error("Erreur getProgrammeById:", err.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


// Récupérer tous les programmes d’un entraîneur
exports.getProgrammesByEntraineur = async (req, res) => {
  try {
    const { key } = req.params;
    const programmes = await Programme.find({ keyEntraineur: key });
    res.status(200).json(programmes);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des programmes.", error });
  }
};

// Modifier un programme
exports.modifierProgramme = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Programme.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Programme introuvable." });
    res.status(200).json({ message: "Programme modifié.", programme: updated });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la modification.", error });
  }
};

// Supprimer un programme
exports.supprimerProgramme = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Programme.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Programme introuvable." });
    res.status(200).json({ message: "Programme supprimé." });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression.", error });
  }
};
