const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const programmeRoutes = require('./routes/programmeRoute');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dossier statique pour les futurs fichiers 
app.use('/uploads/programmes', express.static(path.join(__dirname, 'uploads/programmes')));

// Routes
app.use('/api/programmes', programmeRoutes);

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Connexion à MongoDB réussie');

  const PORT = process.env.PORT || 3003;
  app.listen(PORT, () => {
    console.log(` Serveur Programme démarré sur http://localhost:${PORT}`);
  });
})
.catch((err) => {
  console.error(' Erreur de connexion à MongoDB :', err);
});
