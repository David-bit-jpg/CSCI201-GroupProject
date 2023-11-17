# ChatMate Installation Guide

Before starting, ensure you have the following installed on your system. There are attached instructions/websites for information on how to install each:

**Node.js (version 14.x or later) and npm (Node Package Manager)**
- Visit Node.js Website: [Node.js download page](https://nodejs.org/en/download).
- Choose Your OS: Download the installer suitable for your operating system. 
- **Linux Option**: If you're using Linux, consider using the [NodeSource installer](https://github.com/nodesource/distributions) tailored for Linux environments.
- **Installation**: Execute the installer to set up Node.js and npm.
- **Check npm Installation**: Open your terminal and type `npm -v` to check if npm is installed.

## Cloning and Setting Up ChatMate

**Clone the Repository**
   ```bash
   git clone https://github.com/David-bit-jpg/CSCI201-GroupProject
   cd ChatMate
   npm install
   cd client
   npm install

Database Configuration

- Navigate to the `config` folder.
- Adjust `config.js` to select your database (MySQL/MongoDB) and configure other settings.
- Initialize the database structure:
  - **For MySQL**:
    ```bash
    npm run migrate-mysql
    ```
  - **For MongoDB**:
    ```bash
    npm run migrate-mongo
    ```

Starting the Backend Server

- In the root directory, launch the Express.js server by running:
  ```bash
  npm run start-backend

Setting up the Frontend
- Navigate to the client directory.
Open the .env file and set REACT_APP_BACKEND_URL to the URL of your running backend server.
Initiate the React frontend:
bash
Copy code
npm start

Accessing the Application
Open a web browser and navigate to http://localhost:3000.
Congratulations! You have successfully deployed ChatMate. Enjoy the features of real-time communication and secure messaging. For any issues, consult the error handling section in the technical documentation or contact the ChatMate support team.