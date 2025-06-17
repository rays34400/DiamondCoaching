const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors'); // ✅ ajouté
const clientRoutes = require('./routes/clientRoutes');
const app = express();

dotenv.config();

// Middleware global
app.use(cors()); // 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rendre les images accessibles statiquement
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/clients', clientRoutes);

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Connexion à MongoDB réussie');

  // Démarrer le serveur
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(` Serveur client démarré sur http://localhost:${PORT}`);
  });
})
.catch(err => {
  console.error(' Erreur de connexion à MongoDB :', err);
});
