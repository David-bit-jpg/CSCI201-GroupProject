// handling private chat

module.exports = function (io, users) {
    io.on('connection', (socket) => {
      console.log('User connected for private chat');
  
      // Creating or joining a private room
      socket.on('start private chat', ({ recipientId }) => {
        const privateRoom = [socket.id, recipientId].sort().join('-');
        socket.join(privateRoom);
        if (users[recipientId]) {
          io.to(recipientId).emit('private chat request', { from: socket.id, room: privateRoom });
        }
      });
  
      // Joining a private room
      socket.on('join private room', ({ room }) => {
        socket.join(room);
      });
  
      // Handling private message
      socket.on('private message', ({ room, message }) => {
        io.to(room).emit('private message', { sender: socket.id, message: message });
      });
  
      // Leaving a private room
      socket.on('leave private room', ({ room }) => {
        socket.leave(room);
      });
  
      socket.on('disconnect', () => {
        console.log('User disconnected from private chat');
      });
    });
  };
  