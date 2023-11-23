const jwt = require("jsonwebtoken");
const {connectToDatabase, closeConnection, performQuery} = require("../db");
const secretKey = process.env.JWT_SECRET; // Make sure to set this in your .env file

class userController {
  async validateUser(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required for login' });
    }

    // Perform a SELECT query to check if the username and password match
    const selectQuery = 'SELECT * FROM users WHERE username = ? AND password = ?';
    const selectValues = [username, password];

    try {
      const results = await db.performQuery(selectQuery, selectValues);

      if (results.length > 0) {
        // User found, credentials are valid, generate a JWT token
        const user = results[0];
        const token = jwt.sign({ username: user.username, userId: user.id }, secretKey, { expiresIn: '1h' });

        return res.json({ success: true, message: 'Login successful', token });
      } else {
        // User not found, credentials are invalid
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (error) {
      console.error('Error executing login query:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async createUser(req, res) {
    console.log('hereeee');
    const { username, password, firstName, lastName, email, jwt_token } = req.body;
  
    if (!username || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'All fields are required for registration' });
    }
  
    try {
      // Check if the username already exists
      const checkUsernameQuery = 'SELECT * FROM User WHERE username = ?';
      const existingUser = await performQuery(checkUsernameQuery, [username]);

      if (existingUser.length > 0) {
        return res.status(409).json({ error: 'Username already exists' });
      }
      // If the username is unique, proceed with user registration
      const insertQuery = 'INSERT INTO User (username, password, fname, lname, email, jwt_tokens) VALUES (?, ?, ?, ?, ?, ?)';
      const values = [username, password, firstName, lastName, email, jwt_token];
  
      await performQuery(insertQuery, values);

      console.log("we made it here")
      // User registered successfully
      return { success: true, message: 'User registered successfully' };
     
    } catch (error) {
      console.error('Error executing registration query:', error);
      return { error: 'Internal Server Error' };
    }
  }
  

  logOutUser(req, res) {
    // Assuming the client sends the JWT token in the request headers
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized - No token provided' });
    }

    // Invalidate the token by setting an expiration time in the past
    const pastExpiration = new Date(0);
    const invalidatedToken = jwt.sign({}, secretKey, { expiresIn: pastExpiration });

    return res.json({ success: true, message: 'User logged out successfully', invalidatedToken });
  }
}

module.exports = new userController();
