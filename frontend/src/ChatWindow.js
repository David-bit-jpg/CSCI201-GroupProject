



import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useUser } from './UserContext';
import { createClient } from '@supabase/supabase-js';
const ChatWindow = () => {
const supabase = createClient('https://yoqexdaxczxsdsxoklqr.supabase.co', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvcWV4ZGF4Y3p4c2RzeG9rbHFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDA3NzA4NzksImV4cCI6MjAxNjM0Njg3OX0.jorES7lU3OsMcVO-kDwCrK7NzjXy9Li6wcek3_wavWM")
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const location = useLocation();
  const chatID = useParams().chatID; 
  console.log("CHECKING IF IT WORKS" , chatID)
  console.log(location)
  const chatInfo = location.state?.chatData[0];
   // Access the state from the location
  
  const { userEmail } = useUser();
  console.log(userEmail)

  useEffect(() => {
    const fetchInitialMessages = async () => {
      try {
        console.log(chatID)
        let { data: returnedMessage, error: err  } = await supabase
          .from('Chat')
          .select('messageContent, userID, messageID')
          .eq('chatID', chatID);

          if (err){
            return {success: false}
          }
          if (returnedMessage > 0){
          console.log("this is what is returned", returnedMessage)
          

          const response = await fetch('http://localhost:3000/api/getUserInfo', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userEmail: userEmail,
              // Add other necessary fields
            }),
          });
        
      
          const data = await response.json();
          console.log(data)
          if (data.success){

        console.log(data)


       
        if (data) {
            let formattedMessages = [];
            for (const message of returnedMessage){
                let { data: returnedMessage, error: err  } = await supabase
                .from('User')
                .select('username')
                .eq('userID', message.userID);

                const createMessage = {
                    id: message.messageID,
                    senderID: returnedMessage[0].username, // Assuming userID is the sender's ID
                    messageContent: message.messageContent,
                    isSender: message.userID === data.data.user_id,
                }
                formattedMessages.push(createMessage)
      
            }
            setMessages(formattedMessages);
         
        }
      
    }
    }} catch (error) {
        console.error('An error occurred while fetching initial messages:', error.message);
      }
    };

    fetchInitialMessages();
  }, [chatID, supabase, userEmail]);

  useEffect(() => {
    console.log(location)
    console.log('Subscribing to channel');
    const channel = supabase
      .channel('*')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'Chat',
          columns: ['chatID, messageContent, userID, userIDs, messageID'],
        },
        (payload) => {
            if (payload.new.chatID === chatID) {
          handleNewTask(payload.new.messageContent, payload.new.userID, payload.new.messageID);
        }
        }
      )
      .subscribe();
  
    // Cleanup function to unsubscribe from the channel when the component is unmounted
    return () => {
      console.log('Unsubscribing from channel');
      supabase.removeChannel(channel);
    };
  }, []); // Empty dependency array, meaning the effect runs once after the initial render
  









const handleNewTask = async (newChat, senderID, messageID) => {
        try {
            console.log("in the front end", userEmail, messageID)
          // Assuming you have a field like senderUserID in your newChat object
          const response = await fetch('http://localhost:3000/api/getUserInfo', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userEmail: userEmail,
              // Add other necessary fields
            }),
          });
      
          const data = await response.json();
          if (data.success){

        console.log(data)

          const isSender = senderID === data.data.user_id;
          const message = {
            id: messageID,
            senderID: data.data.username,
            messageContent: newChat,
            isSender: isSender,
          };
      
          // Update the messages state with the new message
          setMessages((prevMessages) => [...prevMessages, message]);
          }
        } catch (error) {
          console.error('An error occurred while fetching data:', error.message);
        }
   

    

    // Create a new message object
   
  };



  const handleSendMessage = async () => {
    try {
        console.log(location)
        console.log(chatID)
        console.log(chatInfo)
    //   const usernamesForEmail = chatInfo.reduce((usernames, user) => {
    //     if (user.chatInfo.email !== userEmail) {
    //       usernames.push(user.userData.username);
    //     }
    //     return usernames;
    //   }, []);
      let recievers = [];
      for (const email of chatInfo){
        if (email.key !== userEmail){
            recievers.push(email.key)
        }
      }
      console.log(chatID, userEmail, recievers, newMessage)
    
      const response = await fetch('http://localhost:3000/api/sendChat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatID,
          sender: userEmail,
          receivers: recievers,
          message: newMessage,
        }),
      });

      const data = await response.json();
      console.log(data)
      if (data.success) {
        // Refresh messages after sending a new message
        // fetchChatMessages();
        console.log("we added a chat")
      } else {
        console.error('Failed to send message:', data.error);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (

        <div style={{ maxWidth: '600px', margin: 'auto' }}>
          <h2>Chat Window</h2>
          <div
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              borderRadius: '5px',
              minHeight: '300px',
              overflowY: 'auto',
            }}
          >
            {/* Display messages with sender information */}
            {messages.map((message) => (
              <div
                key={message.id}  // <-- Assuming "id" is a unique identifier

                style={{
                  textAlign: message.isSender ? 'right' : 'left',
                  margin: '5px 0',
                }}
              >
                <div
                  style={{
                    display: 'inline-block',
                    padding: '8px',
                    borderRadius: '8px',
                    background: message.isSender ? '#007bff' : '#f2f2f2',
                    color: message.isSender ? 'white' : 'black',
                  }}
                >
                  {message.senderID}: {message.messageContent}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '10px' }}>
            {/* Input for new messages */}
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              style={{ width: '80%', padding: '5px' }}
            />
            <button
              onClick={handleSendMessage}
              style={{ padding: '5px', marginLeft: '5px' }}
            >
              Send
            </button>
          </div>
        </div>
      );
    };
    
    export default ChatWindow;
