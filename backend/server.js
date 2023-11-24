const cluster = require('cluster'); // to handle concurrent threading, just give it a try
const numCPUs = require('os').cpus().length;
const express = require("express");
const cors = require('cors');
const privateChatHandler = require("./chat/privateChatHandler");
const groupChatHandler = require("./chat/groupChatHandler");
// const addFriend = require('AddUser/addContactHandler'); 
const userController = require("./controller/userController");
// const {connectToDatabase, closeConnection, performQuery} = require("./db");
// db.connectToDatabase();

require("dotenv").config();

// if (cluster.isMaster) {
//   console.log(`Master ${process.pid} is running`);

//   // Fork workers.
//   for (let i = 0; i < numCPUs; i++) {cle
//       cluster.fork();
//   }

//   cluster.on('exit', (worker, code, signal) => {
//       console.log(`Worker ${worker.process.pid} died`);
//   });
// } 
// else {
  const app = express();
  const port = process.env.PORT || 3000;
  app.use(cors());


  app.use(express.json());




  app.post("/api/createUser", async (req, res) => {
    try {
      const data = await userController.createUser(req);
      console.log(data)
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({
        status: "internal server error",
        error: error.message, // Use error.message to capture the error message
      });
    }
  });

  app.post("/api/loginUser", async (req, res) => {
    try {
      const data = await userController.loginUser(req);
  
      // Check if the login was successful
      if (data) {
        // Successful login
        res.status(200).json({ status: 'success', data: data });
      } else {
        // Unsuccessful login
        res.status(401).json({ status: 'error', message: 'Invalid credentials' });
      }
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
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

  // // app.post('/api/chat', (req, res) => {
  // //     const { participants } = req.body; // assuming participants is an array of user IDs
  // //     if (participants.length === 1) {
  // //         privateChatHandler.handlePrivateChat(req, res);
  // //     } else if (participants.length > 1) {
  // //         groupChatHandler.handleGroupChat(req, res);
  // //     } else {
  // //         res.status(400).send('Must select people to start the conversation');
  // //     }
  // // });
  // app.post('/api/addFriend', (req, res) => {
  //   const { userId, friendUserId } = req.body;

  //   if (!userId || !friendUserId) {
  //       return res.status(400).json({ success: false, message: 'Missing userId or friendUserId in the request body' });
  //   }

  //   addFriend(userId, friendUserId, (result) => {
  //       if (result) {
  //           res.json({ success: true, message: 'Friend added successfully' });
  //       } else {
  //           res.json({ success: false, message: 'Failed to add friend' });
  //       }
  //   });
  // });

  // Start Backend Port
  app.listen(port, () => {
    console.log(`Server listening on the port  ${port}`);
  });


