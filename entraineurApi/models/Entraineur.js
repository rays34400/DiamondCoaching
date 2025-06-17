const mongoose = require('mongoose');

const entraineurSchema = new mongoose.Schema({
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
  specialite: {
    type: String,
    required: true,
  },
  disponibilites: [
  {
    jour: {
      type: String,
      enum: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'],
      required: true,
    },
    heures: [
      {
        type: String, // ex: "08:00", "09:30", "13:00"
      }
    ]
  }
],
  photoProfile: {
    type: String,
    default: '',
  },

  photo: [
    {
      type: String,
      default: [],
    }
  ],
  
  role: {
    type: String,
    default: 'entraineur',
    enum: ['entraineur'],
  },
  keyEntraineur: {
  type: String,
  required: true,
  unique: true
}
}, {
  timestamps: true
});

module.exports = mongoose.model('Entraineur', entraineurSchema);
