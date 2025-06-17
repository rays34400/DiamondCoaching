const AffectationProgramme = require('../models/AffectationProgramme');
const axios = require('axios');

// Affecter un programme à un client
exports.affecterProgramme = async (req, res) => {
  const { programmeId, keyClient, keyEntraineur } = req.body;

  try {
    const affectation = new AffectationProgramme({
  idProgramme: programmeId,
  keyClient,
  keyEntraineur,
});
    await affectation.save();
    res.status(201).json(affectation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Voir les programmes affectés à un client
exports.getProgrammesPourClientComplet = async (req, res) => {
  try {
    const keyClient = req.params.keyClient;
    console.log("🔍 keyClient reçu dans la route :", keyClient);

    const affectations = await AffectationProgramme.find({ keyClient });
    console.log("📦 Affectations trouvées :", affectations);

    // récupérer les programmes avec axios (et non Programme.find si le modèle n’est pas dispo ici)
    const programmes = await Promise.all(
      affectations.map(async (a) => {
        try {
          const response = await axios.get(`http://localhost:3003/api/programmes/${a.idProgramme}`);
          return response.data;
        } catch (err) {
          console.error(`❌ Erreur récupération programme ${a.programmeId}`, err.message);
          return null;
        }
      })
    );

    const programmesValides = programmes.filter(p => p !== null);
    console.log("✅ Programmes retournés :", programmesValides);
    res.json(programmesValides);
  } catch (err) {
    console.error("❌ Erreur générale :", err.message);
    res.status(500).json({ message: err.message });
  }
};


// Voir les programmes affectés par un entraîneur
exports.getProgrammesPourEntraineur = async (req, res) => {
  try {
    const affectations = await AffectationProgramme.find({ keyEntraineur: req.params.key });
    res.json(affectations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
