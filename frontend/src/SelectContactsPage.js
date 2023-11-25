// SelectContactsPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';

const SelectContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const navigate = useNavigate();
  const { userEmail } = useUser();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        // Fetch all contacts
        const response = await fetch('http://localhost:3000/api/getContacts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: userEmail }),
        });
        const data = await response.json();

        if (data.success) {
          setContacts(data.data);
        } else {
          console.error('Failed to fetch contacts');
        }
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };

    fetchContacts();
  }, [userEmail]);

  const handleSelect = (email) => {
    // Toggle selection for the given email
    setSelectedContacts((prevSelected) =>
      prevSelected.includes(email)
        ? prevSelected.filter((selectedEmail) => selectedEmail !== email)
        : [...prevSelected, email]
    );
  };

  const handleMakeGroupChat = async () => {
    try {
      // Create a chat with selectedContacts
      const contactsWithUser = [...selectedContacts, userEmail];

      const response = await fetch('http://localhost:3000/api/createChat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selectedUsers: contactsWithUser }),
      });

      const data = await response.json();
      console.log(data)
      if (data.success) {
        console.log('Chat created successfully');
        console.log(data.chatData)
        // Redirect to the chat page or do other actions as needed
        navigate('/ChatWindow', { state: { chatData: data.chatData } });
      } else {
        console.error('Failed to create chat:', data.error);
      }
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  return (
    <div>
      <h2>Select Contacts</h2>
      <ul>
        {contacts.map((contact) => (
          <li key={contact.email}>
            <label>
              <input
                type="checkbox"
                checked={selectedContacts.includes(contact.email)}
                onChange={() => handleSelect(contact.email)}
              />
              {contact.username} - {contact.email}
            </label>
          </li>
        ))}
      </ul>
      <button onClick={handleMakeGroupChat} disabled={selectedContacts.length === 0}>
        Make Chat
      </button>
    </div>
  );
};

export default SelectContactsPage;
