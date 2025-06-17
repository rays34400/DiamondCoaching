const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

const DemandeRoutes = require('./routes/demandeAffectationRoutes');
const AffectationRoutes = require('./routes/affectationProgrammeRoutes');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/demandes', DemandeRoutes);
app.use('/api/affectations', AffectationRoutes);

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Connexion à MongoDB réussie');
  const PORT = process.env.PORT || 3007;
  app.listen(PORT, () => {
    console.log(` Serveur Affectation démarré sur http://localhost:${PORT}`);
  });
})
.catch((err) => {
  console.error(' Erreur de connexion à MongoDB :', err);
});
