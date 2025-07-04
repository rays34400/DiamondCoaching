const mongoose = require('mongoose');

const programmeSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
  },
  niveau: {
    type: String,
    required: true,
  },
  objectif: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  keyEntraineur: {
    type: String,
    required: true, 
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Programme', programmeSchema);
