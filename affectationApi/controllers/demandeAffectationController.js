const DemandeAffectation = require('../models/DemandeAffectation');

// Envoyer une demande (client ➝ entraîneur)
exports.envoyerDemande = async (req, res) => {
  const { keyClient, keyEntraineur } = req.body;

  if (!keyClient || !keyEntraineur) {
    return res.status(400).json({ message: "Clés manquantes." });
  }

  try {
    const exist = await DemandeAffectation.findOne({ keyClient, keyEntraineur });
    if (exist) return res.status(400).json({ message: "Demande déjà envoyée." });

    const demande = new DemandeAffectation({ keyClient, keyEntraineur });
    await demande.save();

    res.status(201).json(demande);
  } catch (err) {
    console.error("Erreur controller.envoyerDemande :", err);
    res.status(500).json({ message: err.message });
  }
};


// Voir les demandes reçues (côté entraîneur)
exports.getDemandesByEntraineur = async (req, res) => {
  try {
    console.log(req.params.keyEntraineur); // <-- log utile
    const demandes = await DemandeAffectation.find({
      keyEntraineur: req.params.keyEntraineur,
      statut: 'en_attente'
    });

    res.status(200).json(demandes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Clients affectés à un entraîneur (statut accepté)
exports.getClientsAffectes = async (req, res) => {
  try {
    const affectations = await DemandeAffectation.find({
      keyEntraineur: req.params.keyEntraineur,
      statut: 'accepte'
    });
    res.status(200).json(affectations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Entraîneurs liés à un client (statut accepté)
exports.getEntraineursAffectes = async (req, res) => {
  try {
    const affectations = await DemandeAffectation.find({
      keyClient: req.params.keyClient,
      statut: 'accepte'
    });
    res.status(200).json(affectations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Accepter une demande
exports.accepterDemande = async (req, res) => {
  try {
    const demande = await DemandeAffectation.findByIdAndUpdate(
      req.params.id,
      { statut: 'accepte' },
      { new: true }
    );
    if (!demande) return res.status(404).json({ message: "Demande non trouvée" });
    res.json(demande);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
