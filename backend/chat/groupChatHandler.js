// handling group chat fucnctions
const db = require('../db');

function sendGroupMessage(userId, roomId, message, callback) {
  const insertMessageQuery = `INSERT INTO Chat (userID, roomID, messageContent) VALUES (${userId}, ${roomId}, '${message}')`;

  db.performQuery(insertMessageQuery, (error, insertResult) => {
      if (error) {
          console.error('Error sending group message:', error);
          return callback(false);
      }
      return callback(insertResult.affectedRows > 0);
  });
}

function getGroupChatHistory(roomId, callback) {
  const getMessagesQuery = `SELECT * FROM Chat WHERE roomID = ${roomId} ORDER BY timeStamp`;

  db.performQuery(getMessagesQuery, (error, messages) => {
      if (error) {
          console.error('Error retrieving group chat history:', error);
          return callback(null);
      }
      return callback(messages);
  });
}

module.exports = function (io, users, chatRooms) {
    io.on('connection', (socket) => {
      console.log('A user connected');

      socket.on('join room', ({ username, room }) => {
        if (!username || !room) {
          socket.emit('error', 'Username and room are required');
          return;
        }

        users[socket.id] = { username, room };
        socket.join(room);

        // Welcome the current user
        socket.emit('message', `Welcome to the chat, ${username}!`);

        // Broadcast when a user connects
        socket.broadcast.to(room).emit('message', `${username} has joined the chat`);

        if (!chatRooms[room]) {
          chatRooms[room] = { users: [], admin: socket.id, messages: [] };
        }
        chatRooms[room].users.push(socket.id);

        // Send room details and history
        socket.emit('room details', chatRooms[room]);
      });

      socket.on('group message', ({ room, message }) => {
        if (!users[socket.id] || !message) {
            socket.emit('error', 'Invalid message or user not in a room');
            return;
        }

        const userId = users[socket.id].userId; // Assuming you have userId
        dbHandler.sendGroupMessage(userId, room, message, (success) => {
            if (!success) {
                console.error('Error storing message in the database');
                return;
            }
            const userMessage = `${users[socket.id].username}: ${message}`;
            chatRooms[room].messages.push(userMessage); // Save to history
            io.in(room).emit('message', userMessage);
        });
    });

      socket.on('disconnect', () => {
        if (users[socket.id]) {
          const user = users[socket.id];
          console.log(`${user.username} disconnected`);

          // Broadcast when a user leaves
          socket.broadcast.to(user.room).emit('message', `${user.username} has left the chat`);

          // Remove user from room
          if (chatRooms[user.room]) {
            chatRooms[user.room].users = chatRooms[user.room].users.filter(id => id !== socket.id);
          }

          delete users[socket.id];
        }
      });
    });
};