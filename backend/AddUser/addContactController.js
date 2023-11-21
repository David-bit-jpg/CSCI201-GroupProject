// Import the database connection module
const db = require('../db');

function addFriend(userId, friendUserId, callback) {
    // Check if the user exists
    const checkUserQuery = `SELECT COUNT(*) AS userCount FROM User WHERE userID='${userId}'`;

    db.performQuery(checkUserQuery, (error, userResult) => {
        if (error) {
            console.error('Error checking user existence:', error);
            return callback(false);
        }

        if (userResult[0].userCount > 0) {
            // Check if the friendUserID is already in the Friend table
            const checkFriendQuery = `SELECT COUNT(*) AS friendCount FROM Friend WHERE friendUserID='${friendUserId}'`;

            db.performQuery(checkFriendQuery, (error, friendResult) => {
                if (error) {
                    console.error('Error checking friend existence:', error);
                    return callback(false);
                }

                if (friendResult[0].friendCount > 0) {
                    return callback(false); // User is already a friend
                }

                // Add the friend to the Friend table
                const addFriendQuery = `INSERT INTO Friend (userID, friendUserID, friendDate) VALUES ('${userId}', '${friendUserId}', NOW())`;

                db.performQuery(addFriendQuery, (error, insertResult) => {
                    if (error) {
                        console.error('Error adding friend:', error);
                        return callback(false);
                    }

                    return callback(insertResult.affectedRows > 0);
                });
            });
        } else {
            return callback(false); // User does not exist
        }
    });
}

db.connectToDatabase(); // Connect to the database

addFriend('userId1', 'friendUserId1', (result) => {
    console.log('Friend added:', result);
    db.closeConnection(); // Close the database connection after usage
});
