const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const rendezvousRoutes = require('./routes/rendezVousRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3008;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connecté'))
  .catch((err) => console.error('Erreur MongoDB', err));

app.use('/api/rendezvous', rendezvousRoutes);

app.listen(PORT, () => {
  console.log(`API RendezVous lancée sur http://localhost:${PORT}`);
});
