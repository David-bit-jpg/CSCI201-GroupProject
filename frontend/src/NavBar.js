// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import the useHistory hook from React Router




const Navbar = () => {
    const navigate = useNavigate(); // Initialize the history object

    const handleLogout = async () => {
        try {
          // Make an HTTP request to your backend logout endpoint
          const response = await axios.post('http://localhost:3000/api/logOutUser'); // Adjust the endpoint URL accordingly
    
          if (response.data.data) {

            // Successfully logged out
            console.log("User logged out");
            navigate('/login')
            // Perform any additional client-side logout logic if needed
          } else {
            // Logout failed
            console.error("Logout failed");
          }
        } catch (error) {
          console.error("Error during logout:", error);
        }
        return false;

      };
    
  return (
    <div style={navbarStyle}>
      <div style={navLinksStyle}>
        <Link to="/seeChat" style={linkStyle}>
          See Current Chats
        </Link>
        <Link to="/getContacts" style={linkStyle}>
          See Contacts
        </Link>
      </div>
      <div style={navLinksStyle}>  
        <button style={buttonStyle} onClick={() => handleLogout()}>
          Logout
        </button>
      </div>
    </div>
  );
};

// Styles
// Styles
const navbarStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    borderBottom: '1px solid #ddd',
    backgroundColor: '#f4f4f4',
    position: 'fixed',
    width: '100%', // Span the entire width
    top: 0,
    zIndex: 1000,
  };
  

  
  const navLinksStyle = {
    display: 'flex',
    alignItems: 'center',
  };
  
  const linkStyle = {
    textDecoration: 'none',
    color: '#333',
    fontSize: '1.2em', // Set the same font size
    fontWeight: 'bold',
    margin: '0 15px',
  };
  
  
  const buttonStyle = {
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1.2em',
    marginLeft: '800px', // Adjust the distance from the right edge
  };
  
  
  export default Navbar;
  