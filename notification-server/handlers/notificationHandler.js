const notificationHandler = (io, socket) => {
  
  // Odaya katılma mantığı
  socket.on('join-room', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`[Socket] User ${userId} private room created.`);
  });

  // Bildirim gönderme mantığı
  socket.on('send-notification', (data) => {
    const { toUserId, message, type } = data;
    
    io.to(`user_${toUserId}`).emit('new-notification', {
      text: message,
      type: type,
      date: new Date()
    });
  });
};

module.exports = notificationHandler;