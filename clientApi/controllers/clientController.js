const Client = require('../models/Client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Inscription du client
exports.registerClient = async (req, res) => {
  try {
    const { nom, prenom, email, password, adresse, telephone } = req.body;

    const existing = await Client.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const photoProfile = req.file ? req.file.filename : '';

    // ✅ Générer la clé unique
    const keyClient = `CLI-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const newClient = new Client({
      nom,
      prenom,
      email,
      password: hashedPassword,
      adresse,
      telephone,
      photoProfile,
      keyClient, 
    });

    await newClient.save();
    res.status(201).json({ message: "Client inscrit avec succès." });

  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'inscription.", error });
  }
};

// Connexion du client
exports.loginClient = async (req, res) => {
  try {
    const { email, password } = req.body;

    const client = await Client.findOne({ email });
    if (!client) {
      return res.status(404).json({ message: "Email non trouvé." });
    }

    const isMatch = await bcrypt.compare(password, client.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mot de passe incorrect." });
    }

    // Création du token
    const token = jwt.sign(
      { id: client._id, role: 'client' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({ token, id: client._id, message: "Connexion réussie." });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la connexion.", error });
  }
};
exports.getKeyClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id).select('keyClient');
    if (!client) {
      return res.status(404).json({ message: "Client non trouvé." });
    }
    res.status(200).json({ keyClient: client.keyClient });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur.", error });
  }
};

exports.getKeyClientByToken = async (req, res) => {
  try {
    const client = await Client.findById(req.user.id).select('keyClient');
    if (!client) {
      return res.status(404).json({ message: "Client non trouvé." });
    }
    res.status(200).json({ keyClient: client.keyClient });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération.", error });
  }
};
exports.getClientByKey = async (req, res) => {
  try {
    const client = await Client.findOne({ keyClient: req.params.keyClient }).select('-password');
    if (!client) {
      return res.status(404).json({ message: "Client non trouvé." });
    }
    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération.", error });
  }
};

// Récupérer un client par ID (profil)
exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id).select('-password');
    if (!client) {
      return res.status(404).json({ message: "Client non trouvé." });
    }
    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération.", error });
  }
};

exports.updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, prenom, email, adresse, telephone } = req.body;

    const updatedClient = await Client.findByIdAndUpdate(
      id,
      { nom, prenom, email, adresse, telephone },
      { new: true }
    );

    if (!updatedClient) {
      return res.status(404).json({ message: "Client non trouvé." });
    }

    res.status(200).json({ message: "Profil mis à jour avec succès.", client: updatedClient });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour du profil.", error });
  }
};

exports.updatePhotoProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const newPhoto = req.file ? req.file.filename : null;

    if (!newPhoto) {
      return res.status(400).json({ message: "Aucune image fournie." });
    }

    const updatedClient = await Client.findByIdAndUpdate(
      id,
      { photoProfile: newPhoto },
      { new: true }
    );

    if (!updatedClient) {
      return res.status(404).json({ message: "Client non trouvé." });
    }

    res.status(200).json({ message: "Photo de profil mise à jour.", client: updatedClient });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour de la photo.", error });
  }
};

//supprimer client
exports.deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedClient = await Client.findByIdAndDelete(id);
    if (!deletedClient) {
      return res.status(404).json({ message: "Client non trouvé." });
    }

    res.status(200).json({ message: "Compte supprimé avec succès." });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression du compte.", error });
  }
};

// Récupérer un client par son nom
exports.getClientByName = async (req, res) => {
  try {
    const { nom } = req.params;

    const client = await Client.findOne({ nom: nom });

    if (!client) {
      return res.status(404).json({ message: "Client non trouvé." });
    }

    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la recherche du client.", error });
  }
};

