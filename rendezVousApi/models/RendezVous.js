const mongoose = require('mongoose');

const rendezVousSchema = new mongoose.Schema({
  date: { type: String, required: true }, // ex: "2025-06-18"
  heure: { type: String, required: true }, // ex: "13:30"
  keyClient: { type: String, required: true },
  keyEntraineur: { type: String, required: true },
  statut: {
    type: String,
    enum: ['en attente', 'confirmé', 'refusé' , 'fait'],
    default: 'en attente'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('RendezVous', rendezVousSchema);
