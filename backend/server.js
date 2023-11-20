const express = require("express");
const db = require('./db'); // Adjust the path based on your project structure
db.connectToDatabase();

require("dotenv").config();


const app = express();
const port = process.env.PORT || 3000;



app.use(express.json());



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

// Start Backend Port
app.listen(port, () => {
  console.log(`Server listening on the port  ${port}`);
});