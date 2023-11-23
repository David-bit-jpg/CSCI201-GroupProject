// handling private chat
const db = require('../db'); 

function sendPrivateMessage(senderId, receiverId, message, callback) {
  // Logic to determine chatId based on senderId and receiverId
  const chatId = determineChatId(senderId, receiverId);
  const insertMessageQuery = `INSERT INTO Chat (chatID, userID, messageContent) VALUES (${chatId}, ${senderId}, '${message}')`;

  db.performQuery(insertMessageQuery, (error, insertResult) => {
      if (error) {
          console.error('Error sending private message:', error);
          return callback(false);
      }
      return callback(insertResult.affectedRows > 0);
  });
}

function getPrivateChatHistory(chatId, callback) {
  const getMessagesQuery = `SELECT * FROM Chat WHERE chatID = ${chatId} ORDER BY timeStamp`;

  db.performQuery(getMessagesQuery, (error, messages) => {
      if (error) {
          console.error('Error retrieving private chat history:', error);
          return callback(null);
      }
      return callback(messages);
  });
}

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
        // Assume function to extract senderId and receiverId from the room
        const [senderId, receiverId] = extractUserIdsFromRoom(room);

        dbHandler.sendPrivateMessage(senderId, receiverId, message, (success) => {
            if (!success) {
                console.error('Error storing private message in the database');
                return;
            }

            io.to(room).emit('private message', { sender: socket.id, message: message });
        });
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
  