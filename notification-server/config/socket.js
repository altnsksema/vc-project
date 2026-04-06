const { Server } = require('socket.io');

const configureSocket = (server) => {
  return new Server(server, {
    cors: {
      origin: "http://localhost:5173", // Senin Vite portun
      methods: ["GET", "POST"]
    }
  });
};

module.exports = configureSocket;