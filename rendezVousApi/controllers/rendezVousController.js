const RendezVous = require('../models/RendezVous');

//  Prise de rendez-vous (client)
exports.createRendezVous = async (req, res) => {
  try {
    const { date, heure, keyClient, keyEntraineur } = req.body;

    const rdv = new RendezVous({ date, heure, keyClient, keyEntraineur });
    await rdv.save();
    res.status(201).json({ message: 'Rendez-vous demandé avec succès.', rdv });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du rendez-vous.', error });
  }
};

exports.getByClient = async (req, res) => {
  try {
    const { keyClient } = req.params;
    const rdvs = await RendezVous.find({ keyClient });
    res.status(200).json(rdvs);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération.', error });
  }
};

exports.getByEntraineur = async (req, res) => {
  try {
    const { keyEntraineur } = req.params;
    const rdvs = await RendezVous.find({ keyEntraineur });
    res.status(200).json(rdvs);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération.', error });
  }
};

exports.updateStatut = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut } = req.body;

    const rdv = await RendezVous.findByIdAndUpdate(id, { statut }, { new: true });
    res.status(200).json({ message: 'Statut mis à jour.', rdv });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour.', error });
  }
};

exports.deleteRendezVous = async (req, res) => {
  try {
    await RendezVous.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Rendez-vous supprimé.' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur suppression.', err });
  }
};