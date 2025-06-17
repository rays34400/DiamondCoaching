// controllers/messageController.js
const Message = require('../models/Message');

// Envoyer un message
exports.sendMessage = async (req, res) => {
  try {
    const { senderKey, receiverKey, contenu } = req.body;
    const message = new Message({ senderKey, receiverKey, contenu });
    await message.save();
    res.status(201).json({ message: 'Message envoyé avec succès.', data: message });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de lenvoi du message.' });
  }
};

// Récupérer les messages entre deux utilisateurs
exports.getConversation = async (req, res) => {
  try {
    const { key1, key2 } = req.params;
    const messages = await Message.find({
      $or: [
        { senderKey: key1, receiverKey: key2 },
        { senderKey: key2, receiverKey: key1 }
      ]
    }).sort({ dateEnvoi: 1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des messages.' });
  }
};

// Supprimer un message
exports.deleteMessage = async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Message supprimé.' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la suppression du message.' });
  }
};