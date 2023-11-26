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
    <div>
      <h2>List of Chats</h2>
      <ul>
        {chats.map((chat, index) => (
        <li key={index}>
          {chat.map((user) => user.value.fname).join(', ')}
          <button onClick={() => handleChatClick(setChatIDs[index])}>Open Chat</button>
        </li>
        ))}

      </ul>
    </div>
  );
};

export default ChatList;
