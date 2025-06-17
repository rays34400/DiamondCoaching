const Entraineur = require('../models/Entraineur');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

// ✅ Inscription
exports.registerEntraineur = async (req, res) => {
  try {
    const { nom, prenom, email, password, adresse, telephone, specialite, disponibilites } = req.body;
    const parsedDisponibilites = JSON.parse(disponibilites);
    const existing = await Entraineur.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const photoProfile = req.file ? req.file.filename : '';

    // 🔑 Générer une clé unique pour l'entraîneur
    const keyEntraineur = `ENT-${uuidv4()}`;

    const newEntraineur = new Entraineur({
      nom,
      prenom,
      email,
      password: hashedPassword,
      adresse,
      telephone,
      specialite,
      photoProfile,
      keyEntraineur,
      disponibilites: parsedDisponibilites 
    });

    await newEntraineur.save();
    res.status(201).json({ message: "Entraîneur inscrit avec succès." });

  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'inscription.", error });
  }
};


// ✅ Connexion
exports.loginEntraineur = async (req, res) => {
  try {
    const { email, password } = req.body;

    const entraineur = await Entraineur.findOne({ email });
    if (!entraineur) {
      return res.status(404).json({ message: "Email non trouvé." });
    }

    const isMatch = await bcrypt.compare(password, entraineur.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mot de passe incorrect." });
    }

    const token = jwt.sign(
      { id: entraineur._id, role: 'entraineur' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({ token, entraineur, message: "Connexion réussie." });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la connexion.", error });
  }
};

exports.updateDisponibilites = async (req, res) => {
  try {
    const { keyEntraineur } = req.params;
    const { disponibilites } = req.body;

    const parsedDisponibilites = JSON.parse(disponibilites); // utile si tu envoies du JSON stringifié

    const entraineur = await Entraineur.findOneAndUpdate(
      { keyEntraineur },
      { disponibilites: parsedDisponibilites },
      { new: true }
    );

    if (!entraineur) {
      return res.status(404).json({ message: "Entraîneur non trouvé." });
    }

    res.status(200).json({ message: "Disponibilités mises à jour avec succès.", disponibilites: entraineur.disponibilites });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour des disponibilités.", error });
  }
};

// 📥 Récupérer tous les entraîneurs
exports.getAllEntraineurs = async (req, res) => {
  try {
    const entraineurs = await Entraineur.find();
    res.status(200).json(entraineurs);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des entraîneurs", error });
  }
};

// ✅ Obtenir un entraîneur par ID
exports.getEntraineurById = async (req, res) => {
  try {
    const entraineur = await Entraineur.findById(req.params.id).select('-password');
    if (!entraineur) {
      console.log(res.data)
      return res.status(404).json({ message: "Entraîneur non trouvé." });
    }
    res.status(200).json(entraineur);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération.", error });
  }
};

// ✅ Mise à jour des infos (sauf photo)
exports.updateEntraineur = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, prenom, email, adresse, telephone, specialite } = req.body;

    const updated = await Entraineur.findByIdAndUpdate(
      id,
      { nom, prenom, email, adresse, telephone, specialite },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Entraîneur non trouvé." });
    }

    res.status(200).json({ message: "Profil mis à jour.", entraineur: updated });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour.", error });
  }
};

exports.getEntraineurByKey = async (req, res) => {
  try {
    const entraineur = await Entraineur.findOne({ keyEntraineur: req.params.keyEntraineur }).select('-password');
    if (!entraineur) {
      return res.status(404).json({ message: "entraineur non trouvé." });
    }
    res.status(200).json(entraineur);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération.", error });
  }
};

// ✅ Mise à jour de la photo
exports.updatePhotoProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const newPhoto = req.file ? req.file.filename : null;

    if (!newPhoto) {
      return res.status(400).json({ message: "Aucune image fournie." });
    }

    const updated = await Entraineur.findByIdAndUpdate(
      id,
      { photoProfile: newPhoto },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Entraîneur non trouvé." });
    }

    res.status(200).json({ message: "Photo de profil mise à jour.", entraineur: updated });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors du changement de photo.", error });
  }
};

// ✅ Suppression du compte
exports.deleteEntraineur = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Entraineur.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Entraîneur non trouvé." });
    }
    res.status(200).json({ message: "Compte supprimé avec succès." });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression.", error });
  }
};

// ✅ Récupération par nom
exports.getEntraineurByName = async (req, res) => {
  try {
    const { nom } = req.params;
    const entraineur = await Entraineur.findOne({ nom });

    if (!entraineur) {
      return res.status(404).json({ message: "Entraîneur non trouvé." });
    }

    res.status(200).json(entraineur);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la recherche.", error });
  }
};
