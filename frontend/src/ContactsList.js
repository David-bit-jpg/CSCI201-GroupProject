import React, { useState, useEffect } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { useUser } from './UserContext';

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const { userEmail } = useUser();
  const navigate = useNavigate(); // useNavigate hook for programmatic navigation

  useEffect(() => {
    const getContacts = async () => {
      try {
        console.log("here")
        // Fetch contacts for the currently signed-in user
        const response = await fetch('http://localhost:3000/api/getContacts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: userEmail }), // Use the userEmail from the context
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

    getContacts();
  }, [userEmail]); // Trigger the effect whenever userEmail changes
  
  return (
    <div>
      <h2>Contact List for {userEmail}</h2>
      <ul>
        {contacts.map(contact => (
          <li key={contact.email}>
            {contact.username} - {contact.email}
          </li>
        ))}
      </ul>
      <Link to="/addContact">
        <button>Add Contact</button>
      </Link>
      <Link to="/select-contacts">
        <button>Select Contact</button>
      </Link>
      <Link to="/seeChat">
        <button>See Chats</button>
      </Link>

    </div>
  );
};

export default ContactList;