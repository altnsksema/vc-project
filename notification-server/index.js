const express = require('express');
const http = require('http');
const configureSocket = require('./config/socket');
const notificationHandler = require('./handlers/notificationHandler');

const app = express();
const server = http.createServer(app);
const io = configureSocket(server);

io.on('connection', (socket) => {
  console.log('⚡ New client connected:', socket.id);
  
  // Handler'ı buraya enjekte ediyoruz
  notificationHandler(io, socket);

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected');
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`🚀 Notification Server ready at http://localhost:${PORT}`);
});