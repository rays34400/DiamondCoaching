const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
  },
  prenom: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  adresse: {
    type: String,
    required: true,
  },
  telephone: {
    type: String,
    required: true,
  },
  photoProfile: {
    type: String, // nom du fichier image ou URL
    default: '',
  },
  photo: [
    {
      type: String, // tableau de chemins vers les images
      default: [],
    }
  ],
  role: {
    type: String,
    default: 'client', // valeur par défaut
    enum: ['client'], // on peut étendre plus tard si besoin
  },
  keyClient: {
  type: String,
  required: true,
  unique: true
}
}, {
  timestamps: true
});

module.exports = mongoose.model('Client', clientSchema);
