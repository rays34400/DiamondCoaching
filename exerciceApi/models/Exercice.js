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
    type: String, // chemin du fichier image uploadé
  },
  video: {
    type: String, // chemin du fichier vidéo uploadée
  },
  note: {
    type: String, // commentaire ou conseil
  },
  programmeId: {
    type: mongoose.Schema.Types.String, // string si vous gardez des IDs simples
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Exercice', exerciceSchema);
