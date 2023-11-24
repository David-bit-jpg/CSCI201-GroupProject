// const mysql = require('mysql2');
// const { Client } = require('ssh2');
// require('dotenv').config();
// const sshClient = new Client();

// // Initial MySQL connection config
// const connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: process.env.DB_PORT,
//   ssl: {
//     // Enable SSL with TLS_AES_256_GCM_SHA384
//     rejectUnauthorized: false,
//     secureProtocol: 'TLSv1_2_method',
//     ciphers: 'TLS_AES_256_GCM_SHA384',
//   },
// });



// const connectToDatabase = () => {
//   console.log(process.env.DB_PORT)
//   connection.connect((error) => {
//     if (error) {
//       console.error('Error connecting to the database:', error);
//     } else {
//       console.log('Connected to the database');
//     }
//   });
// };

// const closeConnection = () => {
//   connection.end();
//   console.log('Connection closed');
// };

// const performQuery = (query, values) => {
//   return new Promise((resolve, reject) => {
//     connection.query(query, values, (error, results, fields) => {
//       if (error) {
//         console.error('Error executing query:', error);
//         reject(error);
//       } else {
//         console.log('Query successful. Results:', results);
//         resolve(results);
//         console.log('Promise resolved');

//       }
//     });
//   });
// };



// module.exports = {
//   connectToDatabase,
//   closeConnection,
//   performQuery,
// };
