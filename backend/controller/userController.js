const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET; // Make sure to set this in your .env file
const supabase = require('../supa');

class userController {


 // @route POST /api/users/login
 async loginUser(req, res) {
  try {
    const { email, password } = req.body;
    console.log("Logging in...");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.log(data)
    if (error) {
      console.error("Login error:", error);
      return {data: false};
    }

    console.log("Login successful!");
    return {data: true };
  } catch (error) {
    console.error("Unexpected error during login:", error);
    return res.status(500).json({ status: "error", message: "Internal server error" });
  }
}

async createGuest(req, res) {
  try {
    console.log("Logging in...");

    const { data, error } = await supabase
    .from('guests')
    .upsert({ chats: [] })
    .select()

    if (error) {
      console.error("Login error:", error);
      return {success: false};
    }
    console.log("insertion successful " + data)
    return {success: true, data}

  } catch (error) {
    console.error("Unexpected error during login:", error);
    return res.status(500).json({ status: "error", message: "Internal server error" });
  }
}


  async createUser(req, res){
    try {
      const {username, password, fname, lname, email} = req.body
      const { data, error } = await supabase.auth.signUp({
          email,
          password,
      })
      console.log("after sign in")
      if (error){
   
          return {success:false, response};
          // throw new Error("Can't register", error);
    }   
      const user_id = data.user.id;
      // console.log("after userid", userId)
      const response = await supabase.from('User')
      .insert({user_id, username, password, fname, lname, email})

      if (response.error){
          console.log(response.error)
          return {success: false, response}
      }
          
      return {success: true, response};  
  } catch (error) {
      console.log(error);
      return res.status(500).json({msg:"server error"});
    }
  }



  async getUserInfo(req, res){

    try{
      const {userEmail} = req.body;
      console.log(userEmail)
      let { data: info, error } = await supabase
      .from('User')
      .select('username, email, user_id')
      .ilike('email', userEmail)
      if (error){
        return {success: false}
      }
      console.log(info)
      return {success: true, data: info[0]}


    }
    catch(error){
      return res.status(500);
    }

        
        

  }
  

// things to add  (ADDING SAME CONTACT TWICE!!!, where to store all the contact information?)
  async addContact(req, res) {
    try {
      const { username, email, fname, lname } = req.body;
  
      console.log(email);
      const { data: { user } } = await supabase.auth.getUser();

      console.log(user)
  
      const { data: friendData, error: friendError } = await supabase
        .from('User')
        .select('friend_ids')
        .eq('user_id', user.id);
        console.log("in the add contact" , friendData)
  
      if (friendError) {
        console.error('Error fetching friend data:', friendError.message);
        return {
          status: false,
          error: friendError,
        };
      }
  
      const { data: userData, error: userError2 } = await supabase
        .from('User')
        .select('user_id')
        .ilike('email', email);
  
      if (userError2) {
        console.error('Error fetching user data:', userError2.message);
        return {
          status: false,
          error: userError2,
        };
      }
  
      // Assuming both queries are successful
      const friendIds = friendData[0].friend_ids || [];
      const userId = userData[0].user_id;
  
      // Add the userId to the friendIds array
      friendIds.push(userId);
      console.log(friendIds);
  
      const { data: otherFriendData, error: otherFriendError } = await supabase
        .from('User')
        .select('friend_ids')
        .eq('user_id', userId);
  
      if (otherFriendError) {
        console.error('Error fetching other friend data:', otherFriendError.message);
          return {
          status: false,
          error: userError2,
        };
      }
  
      const secondFriendsIdArray = otherFriendData[0].friend_ids || [];
      secondFriendsIdArray.push(user.id);
      console.log(secondFriendsIdArray)
  
      const { response, error: updateError1 } = await supabase.from('User')
        .update({ friend_ids: friendIds })
        .eq('user_id', user.id);
  
      if (updateError1) {
        console.error('Error updating user data:', updateError1.message);
         return {
          status: false,
          error: userError2,
        };
      }
  
      const { response2, error: updateError2 } = await supabase.from('User')
        .update({ friend_ids: secondFriendsIdArray })
        .eq('user_id', userId);
  
      if (updateError2) {
        console.error('Error updating other user data:', updateError2.message);
        return {
          status: false,
          error: userError2,
        };
      }
  
      return { status: true };
    } catch (error) {
      console.error('General error:', error.message);
      return res.status(500).json({ msg: "server error" });
    }
  }

  async getContacts(req, res){
    const { email } = req.body;

    let { data: friends, error } = await supabase
    .from('User')
    .select('friend_ids')
    .ilike('email', email)

    if (error){
      return {status: false}
    }
    const friendsArr = friends[0].friend_ids;
    let arrOfInfo = [];
    for (const friend of friendsArr){
      console.log(friend)
      let { data: info, error } = await supabase
      .from('User')
      .select('username, fname, lname, email')
      .eq('user_id', friend)

        const userObject = {
          username: info[0].username,
          fname: info[0].fname,
          lname: info[0].lname,
          email: info[0].email,
      };
      arrOfInfo.push(userObject);
      

    }
    return {success: true, data: arrOfInfo}


  }
  

  // add a logout button
  async logoutUser(req, res) {
    const { error } = await supabase.auth.signOut();
    if (error){
        return {data: false, msg:"Could not logout"};
    }
    else{
      return {data: true, msg:"logged out"};

    }
  }
}




module.exports = new userController();
