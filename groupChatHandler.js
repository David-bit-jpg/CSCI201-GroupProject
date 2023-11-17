// handling group chat fucnctions


module.exports = function (io, users, chatRooms) {
    io.on('connection', (socket) => {
      console.log('A user connected');
  
      socket.on('join room', ({ username, room }) => {
        users[socket.id] = { username, room };
        socket.join(room);
        socket.to(room).emit('message', `${username} has joined the chat`);
  
        if (!chatRooms[room]) {
          chatRooms[room] = { users: [], admin: socket.id };
        }
        chatRooms[room].users.push(socket.id);
  
        // Notify the user about the room details
        socket.emit('room details', chatRooms[room]);
      });
  
      socket.on('group message', ({ room, message }) => {
        socket.to(room).emit('message', `${users[socket.id].username}: ${message}`);
      });
  
      socket.on('private message', ({ recipientId, message }) => {
        if (users[recipientId] && users[recipientId].room === users[socket.id].room) {
          io.to(recipientId).emit('private message', {
            sender: users[socket.id].username,
            message: message
          });
        }
      });
  
      socket.on('list users', ({ room }) => {
        let userList = Object.values(users).filter(user => user.room === room);
        socket.emit('user list', userList.map(user => user.username));
      });
  
      socket.on('leave room', () => {
        if (users[socket.id]) {
          const room = users[socket.id].room;
          socket.leave(room);
          socket.to(room).emit('message', `${users[socket.id].username} has left the chat`);
          chatRooms[room].users = chatRooms[room].users.filter(id => id !== socket.id);
          delete users[socket.id];
        }
      });
  
      socket.on('disconnect', () => {
        if (users[socket.id]) {
          console.log(`${users[socket.id].username} disconnected`);
          const room = users[socket.id].room;
          chatRooms[room].users = chatRooms[room].users.filter(id => id !== socket.id);
          delete users[socket.id];
        }
      });
    });
  };
  