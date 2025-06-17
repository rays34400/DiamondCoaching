
const mongoose = require('mongoose');

const AffectationProgrammeSchema = new mongoose.Schema({
  keyClient: { type: String, required: true },
  keyEntraineur: { type: String, required: true },
  idProgramme: { type: String, required: true },
  dateAffectation: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AffectationProgramme', AffectationProgrammeSchema);
