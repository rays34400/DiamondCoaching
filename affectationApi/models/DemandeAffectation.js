// models/DemandeAffectation.js
const mongoose = require('mongoose');

const DemandeAffectationSchema = new mongoose.Schema({
  keyClient: {
    type: String,
    required: true
  },
  keyEntraineur: {
    type: String,
    required: true
  },
  statut: {
    type: String,
    default: 'en_attente' // 'accepte' après validation
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('DemandeAffectation', DemandeAffectationSchema);
