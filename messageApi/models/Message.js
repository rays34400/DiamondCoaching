const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderKey: { type: String, required: true },      // Clé de l'expéditeur (client ou entraineur)
  receiverKey: { type: String, required: true },    // Clé du destinataire
  contenu: { type: String, required: true },
  dateEnvoi: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);