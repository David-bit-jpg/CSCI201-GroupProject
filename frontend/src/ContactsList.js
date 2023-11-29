import React, { useState, useEffect } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { useUser } from './UserContext';
import Navbar from './NavBar'; // Import the Navbar component

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
      <Navbar/>
    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <h2 style={{ color: '#333', textAlign: 'center', marginBottom: '20px' }}>Contact List for {userEmail}</h2>
      <div style={{ maxHeight: '20%', overflowY: 'auto',  alignItems: 'center',marginLeft :'24%' }}>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {contacts.map(contact => (
          <li key={contact.email} style={{ backgroundColor: '#fff' , marginBottom: '10px', padding: '10px', borderRadius: '5px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)', width:'50%'}}>
            {contact.username} - {contact.email}
          </li>
        ))}
      </ul>
      </div>
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
    </div>
  );
};

export default ContactList;