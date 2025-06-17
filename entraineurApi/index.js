const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');

const entraineurRoutes = require('./routes/entraineurRoutes');

const app = express();
dotenv.config();

// Middlewares globaux
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rendre le dossier uploads accessible
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/entraineurs', entraineurRoutes);

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connexion à MongoDB réussie');

  const PORT = process.env.PORT || 3002;
  app.listen(PORT, () => {
    console.log(`🚀 Serveur entraîneur démarré sur http://localhost:${PORT}`);
  });
})
.catch((err) => {
  console.error('❌ Erreur de connexion à MongoDB :', err);
});
