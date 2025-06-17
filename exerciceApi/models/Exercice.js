// models/Exercice.js
const mongoose = require('mongoose');

const exerciceSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  image: {
    type: String, 
  },
  video: {
    type: String, 
  },
  note: {
    type: String, 
  },
  programmeId: {
    type: mongoose.Schema.Types.String, 
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Exercice', exerciceSchema);
