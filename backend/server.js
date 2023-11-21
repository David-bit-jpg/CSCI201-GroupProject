const cluster = require('cluster'); // to handle concurrent threading, just give it a try
const numCPUs = require('os').cpus().length;
const express = require("express");
const privateChatHandler = require('./backend/chat/privateChatHandler.js');
const groupChatHandler = require('./backend/chat/groupChatHandler.js');
const addFriend = require('./backend/chat/addContactHandler.js'); 

const db = require('./db'); // Adjust the path based on your project structure
// db.connectToDatabase();

require("dotenv").config();

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
      console.log(`Worker ${worker.process.pid} died`);
  });
} 
else {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(express.json());
  db.connectToDatabase();



  app.post("/api/createUser", (req, res) => {
    userController
      .createUser(req)
      .then((data) => {
        res.status(201).json({
          status: "success",
        });
      })
      .catch((error) => {
        res.status(500).json({
          status: "internal server error",
          error: error,
        });
      });
  });

  app.post("/api/validateUser", (req, res) => {
    userController
      .validateUser(req)
      .then((data) => res.status(200).json(data))
      .catch((error) => {
        res.status(500).json({
          status: "internal server error",
          error: error,
        });
      });
  });

  app.post("/api/logOutUser", (req, res) => {
      userController
        .logoutUser(req)
        .then((data) => res.status(200).json(data))
        .catch((error) => {
          res.status(500).json({
            status: "internal server error",
            error: error,
          });
        });
    });

  app.post('/api/chat', (req, res) => {
      const { participants } = req.body; // assuming participants is an array of user IDs
      if (participants.length === 1) {
          privateChatHandler.handlePrivateChat(req, res);
      } else if (participants.length > 1) {
          groupChatHandler.handleGroupChat(req, res);
      } else {
          res.status(400).send('Must select people to start the conversation');
      }
  });
  app.post('/api/addFriend', (req, res) => {
    const { userId, friendUserId } = req.body;

    if (!userId || !friendUserId) {
        return res.status(400).json({ success: false, message: 'Missing userId or friendUserId in the request body' });
    }

    addFriend(userId, friendUserId, (result) => {
        if (result) {
            res.json({ success: true, message: 'Friend added successfully' });
        } else {
            res.json({ success: false, message: 'Failed to add friend' });
        }
    });
  });

  // Start Backend Port
  app.listen(port, () => {
    console.log(`Server listening on the port  ${port}`);
  });

}
