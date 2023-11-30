const cluster = require('cluster'); // to handle concurrent threading, just give it a try
const numCPUs = require('os').cpus().length;
const express = require("express");
const cors = require('cors');

// const addFriend = require('AddUser/addContactHandler'); 
const userController = require("./controller/userController");
const chatHandler = require("./chat/chatHandler");


require("dotenv").config();

  const app = express();
  const port = process.env.PORT || 3000;
  app.use(cors());


  app.use(express.json());
  
  if (cluster.isMaster) {
    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
  } 
  else {







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

  app.post("/api/addContact", async (req, res) => {
    try {
        console.log("in this");
        const data = await userController.addContact(req);
        if (data.status){
          return res.status(200).json(data);
        }
    } catch (error) {
        res.status(500).json({
            status: "internal server error",
            error: error.message || "An error occurred.",
        });
    }
});


app.post("/api/getContacts", async (req, res) => {
  try {
      console.log("in this");
      const data = await userController.getContacts(req);
      if (data.success){
        return res.status(200).json(data);
      }
  } catch (error) {
      res.status(500).json({
          status: "internal server error",
          error: error.message || "An error occurred.",
      });
  }
});


app.post("/api/createGuest", async (req, res) => {
  try {
      console.log("in this");
      const data = await userController.createGuest(req);
      if (data.success){
        return res.status(200).json(data);
      }
  } catch (error) {
      res.status(500).json({
          status: "internal server error",
          error: error.message || "An error occurred.",
      });
  }
});

app.post("/api/sendGuestChat", async (req, res) => {
  try {
      console.log("in this");
      const data = await chatHandler.sendGuestChat(req);
      if (data.success){
        return res.status(200).json(data);
      }
  } catch (error) {
      res.status(500).json({
          status: "internal server error",
          error: error.message || "An error occurred.",
      });
  }
});

app.post("/api/createChat", async (req, res) => {
  try {
      console.log("in this");
      const data = await chatHandler.createChat(req);
      if (data.success){
        return res.status(200).json(data);
      }
  } catch (error) {
      res.status(500).json({
          status: "internal server error",
          error: error.message || "An error occurred.",
      });
  }
});

app.post("/api/getUserInfo", async (req, res) => {
  try {
      console.log("in this");
      const data = await userController.getUserInfo(req);
      if (data.success){
        return res.status(200).json(data);
      }
  } catch (error) {
      res.status(500).json({
          status: "internal server error",
          error: error.message || "An error occurred.",
      });
  }
});

app.post("/api/sendChat", async (req, res) => {
  try {
      console.log("in this");
      const data = await chatHandler.sendChat(req);
      if (data.success){
        return res.status(200).json(data);
      }
  } catch (error) {
      res.status(500).json({
          status: "internal server error",
          error: error.message || "An error occurred.",
      });
  }
});

app.post("/api/getChats", async (req, res) => {
  try {
      console.log("in getChats");
      const data = await chatHandler.getListOfChats(req);
      if (data.success){
        return res.status(200).json(data);
      }
  } catch (error) {
      res.status(500).json({
          status: "internal server error",
          error: error.message || "An error occurred.",
      });
  }
});




  // Start Backend Port
  app.listen(port, () => {
    console.log(`Server listening on the port  ${port}`);
  });
}


