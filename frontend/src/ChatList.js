import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext'; // Assuming you have a UserContext to get user details

const ChatList = () => {
  const { userEmail } = useUser(); // Use the UserContext to get user details
  const [chats, setChats] = useState([]);
  const [setChatIDs, setChatIDsState] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getListOfChats = async () => {
      try {
        console.log('here',userEmail)
        const response = await fetch('http://localhost:3000/api/getChats', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: userEmail, // Use the logged-in user's email
          }),
        });

        const data = await response.json();
        console.log(data)
        if (data.success) {
          console.log(data.ids)
          setChats(data.response);
          setChatIDsState(data.ids);

        } else {
          console.error('Failed to fetch list of chats:', data.error);
        }
      } catch (error) {
        console.error('An error occurred while fetching list of chats:', error.message);
      }
    };

    getListOfChats();
  }, [userEmail]);

  const handleChatClick = (chatID) => {
    // Redirect to the chat window for the specific chat
    navigate(`/ChatWindow/${chatID}`, { state: { chatData: chats } });
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <h2 style={{ color: '#333', textAlign: 'center', marginBottom: '20px' }}>List of Chats</h2>
      <div style={{ maxHeight: '40%', overflowY: 'auto',  alignItems: 'center',marginLeft :'24%' }}>
      <ul style={{ listStyle: 'none', padding: 0 }}>
          {chats.map((chat, index) => (
              <li key={index} style={{ backgroundColor: '#fff' , marginBottom: '10px', padding: '10px', borderRadius: '5px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)', width:'50%'}}>
                  {chat.map((user) => user.value.fname).join(', ')}
                  <button onClick={() => handleChatClick(setChatIDs[index])} style={{ marginLeft: '10px', padding: '5px 10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Open Chat</button>
              </li>
          ))}
      </ul>
    </div>
  </div>

  );
};

export default ChatList;
