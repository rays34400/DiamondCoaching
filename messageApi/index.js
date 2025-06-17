const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const messageRoutes = require('./routes/messageRoutes');

const app = express();
const server = http.createServer(app); // Serveur HTTP
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connexion MongoDB réussie.'))
.catch(err => console.error('Erreur MongoDB :', err));

// Routes
app.use('/api/messages', messageRoutes);

// Socket.IO
io.on('connection', (socket) => {
  console.log('Nouvel utilisateur connecté:', socket.id);

  socket.on('joinRoom', ({ keyClient, keyEntraineur }) => {
    const roomId = [keyClient, keyEntraineur].sort().join('-');
    socket.join(roomId);
    console.log(`${socket.id} a rejoint la salle ${roomId}`);
  });

  socket.on('sendMessage', ({ senderKey, receiverKey, contenu }) => {
    const roomId = [senderKey, receiverKey].sort().join('-');
    io.to(roomId).emit('receiveMessage', { senderKey, contenu });
  });

  socket.on('disconnect', () => {
    console.log('Utilisateur déconnecté:', socket.id);
  });
});

// Démarrer le serveur
const PORT = process.env.PORT || 3009;
server.listen(PORT, () => {
  console.log(`Serveur avec Socket.IO en cours sur le port ${PORT}`);
});
