const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const exerciceRoutes = require('./routes/exerciceRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rendre les fichiers uploadés accessibles (directement dans /uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/exercices', exerciceRoutes);

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Connexion à MongoDB réussie');
  const PORT = process.env.PORT || 3004;
  app.listen(PORT, () => {
    console.log(`🚀 Serveur Exercice démarré sur http://localhost:${PORT}`);
  });
})
.catch((err) => {
  console.error('❌ Erreur de connexion à MongoDB :', err);
});
