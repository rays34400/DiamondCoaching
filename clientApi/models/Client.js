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
    type: String, 
    default: '',
  },
  photo: [           //pour fonctionaliter futur = ajouter des photos de soi genre facebook 
    {
      type: String, 
      default: [],
    }
  ],
  role: {
    type: String,
    default: 'client', 
    enum: ['client'], 
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
