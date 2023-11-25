const supabase = require('../supa');
class chatHandler {
    async createChat(req, res) {
        const selectedUsers = req.body.selectedUsers;
        const resultArray = [];
        console.log(selectedUsers)
        // Use Promise.all to wait for all asynchronous operations to complete
        await Promise.all(selectedUsers.map(async (email) => {
            // Query the database
            const { data, error } = await supabase
                .from("User")
                .select('user_id, fname, lname, email')
                .ilike('email', email);

            if (error) {
                console.error(`Error querying Supabase for ${username}: ${error.message}`);
                return;
            }
            console.log(data)

            if (data.length > 0) {
                const userObject = {
                    user_id: data[0].user_id,
                    fname: data[0].fname,
                    lname: data[0].lname,
                    email: data[0].email,
                };
                const item = {
                    key: data[0].email,
                    value: userObject,
                }
                resultArray.push(item);
            } else {
                console.log(`User ${username} not found in the database.`);
            }
        }));

        const { data: chatData, error: chatError } = await supabase
        .from("chats_info")
        .upsert([
            {
                // Assuming "chats" table has a column named "chat_data"
                user_info: resultArray,
            }
        ]).select();

        console.log("here")


        if (chatError) {
            console.error(`Error inserting/updating into "chats_info" table: ${chatError.message}`);
            // Handle the error and send an appropriate response
            return { success: false, error: chatError.message };
        }


        console.log("in this", resultArray)

        if (chatData) {
            console.log("in this", resultArray)
            await Promise.all(resultArray.map(async (userObject) => {
                console.log(userObject)
                const userId = userObject.value.user_id;

                console.log(userId)
                // Perform an update on the user table to add the chat ID to the chat_ids array
                const { data: userData, error: userError } = await supabase
                    .from("User")
                    .select("chatids")
                    .eq("user_id", userId);
                
                if (userError) {
                    console.error(`Error updating user ${userId}: ${userError.message}`);
                }
                console.log(userData)
                const userArr = userData[0].user_id || [];
                console.log(userArr)
                userArr.push(chatData[0].chat_id)
                const { response, error: updateError1 } = await supabase.from('User')
                .update({ "chatids": userArr })
                .eq('user_id', userId);

                if (updateError1){
                    return {success: false, error: updateError1.message}
                }
                
            }));

            console.log("Data successfully inserted/updated into 'chats_info' table");
            return { success: true, chatData: chatData };
        } else {
            console.error("Unknown error during insert/update operation");
            return { success: false, error: "Unknown error" };
        }


        // Now resultArray contains all the user objects
        // Do something with the resultArray, for example, send it as a response
        // res.json(resultArray);
    }

    async sendChat(req, res) {
        // add to chat database
        const {chat_id, sender, receivers, message} = req.body;
        console.log("here", chat_id, sender,receivers, message )
        // const { findSender, errorSend } = await supabase
        //         .from('User')
        //         .select('user_id')
        //         .ilike('username', sender);
        let { data: findSender, errorSend } = await supabase
        .from('User')
        .select("user_id")
        .ilike("email", sender)
        

        if (errorSend){
            return {success: false, error: errorSend.message}
        }

        console.log("this is " , findSender)

        const recievArr = [];
        console.log(receivers)
        for (const receiver of receivers) {
            console.log(receiver)
            let { data: findReceiver, errRec } = await supabase
                .from('User')
                .select("user_id")
                .ilike("email", receiver)
          

            if (errRec){
                return {success: false, error: errRec.message}
            }
            console.log(findReceiver)

            recievArr.push(findReceiver[0].user_id);
        }


        const { data, error } = await supabase
        .from('Chat')
        .insert([
            { "chatID": chat_id, "userID": findSender[0].user_id, "messageContent": message, "userIDs": recievArr},
        ])
        .select()
        console.log("we added it" , data)

        if (error){
            return {success: false, error: error.message}
        }

        return {success: true, message: "added chat"}

    }

    async getChat(req, res){

        
        

    }

    async getListOfChats(req, res){
        const {email} = req.body;

        let { data: findChats, errorSend } = await supabase
        .from('User')
        .select("chatids")
        .ilike("email", email);

        if (errorSend){
            return {success: false, error: errorSend.error}
        }
        let arrOfChats = [];
        const arrOfChatIds = findChats[0].chatids;
        console.log(arrOfChatIds)
        for (const chat of arrOfChatIds){
            console.log(chat)
            let { data: findPeople, errorSend } = await supabase
            .from('chats_info')
            .select("user_info")
            .eq("chat_id", chat);
            if (errorSend){
                return {success:false, error: errorSend.error}
            }

            arrOfChats.push(findPeople[0].user_info);
            
            

        }
        

        return {success:true, response: arrOfChats}


    }


}
module.exports = new chatHandler();
