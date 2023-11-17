const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Store users and chat rooms
let users = {};
let chatRooms = {};

io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle joining a room
  socket.on('join room', ({ username, room }) => {
    users[socket.id] = username;
    socket.join(room);

    // Notify room of new user
    socket.to(room).emit('message', `${username} has joined the chat`);

    // Handle chat room logic
    if (!chatRooms[room]) {
      chatRooms[room] = [];
    }
    chatRooms[room].push(socket.id);
  });

  // Handle individual message
  socket.on('individual message', ({ recipientId, message }) => {
    socket.to(recipientId).emit('individual message', {
      sender: users[socket.id],
      message: message
    });
  });

  // Handle group message
  socket.on('group message', ({ room, message }) => {
    socket.to(room).emit('message', `${users[socket.id]}: ${message}`);
  });

  socket.on('disconnect', () => {
    console.log(`${users[socket.id]} disconnected`);
    delete users[socket.id];
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
