// main server file

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const groupChatHandler = require('./groupChatHandler');

const PORT = process.env.PORT || 3000;
let users = {};
let chatRooms = {};

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Group chat handler
groupChatHandler(io, users, chatRooms);

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
