import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Make sure to install axios using `npm install axios` or `yarn add axios`
import { useUser } from './UserContext';
import './Styling.css';

const LoginFake = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState(null);
  const { setUser } = useUser();

  const navigate = useNavigate(); // useNavigate hook for programmatic navigation

  const handleGuestLogin = async () => {

    try {
      console.log("HERE in guest");
      // Make your API call here
      const response = await fetch('http://localhost:8080/JavaBackend/LoginServlet', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
       // mode: "no-cors"
        // Additional options, headers, body, etc.
      });
      console.log(response)

    //   $.ajax({
    //         type: 'GET',
    //         url: 'LoginServlet', 
    //         contentType: 'application/json', // Add this line
    // // Replace with the actual URL of your servlet
    //         success: function (data) {
    //             // Handle the response from the servlet (data)
                
                
                
                
    //             // add login key??? 


    //             // Assuming the servlet returns JSON data, you can parse it and then call displayResults
    //         },
    //         error: function (error) {
    //             console.error('Error:', error);
    //         }
    //     });  	

      // Handle the response as needed
    //   if (response.ok) {
    //     const data = await response.json();
    //     const chatID = "f4b2fdfd-82da-48a3-95bd-ba5fa0edc709";
    //     const guestID = data.data[0].id
    //     navigate(`/GuestChat/${chatID}/${guestID}`)
    //     // Handle the data or redirect, etc.
    //   } else {
    //     console.error('API call failed:', response.status);
    //     // Handle the error, show a message, redirect, etc.
    //   }
    } catch (error) {
      console.error('Unexpected error during API call:', error);
      // Handle the error, show a message, redirect, etc.
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/api/loginUser', {
        email,
        password,
      });

      const result = response.data;

      setLoginStatus(result.data);
      if (result.data.data) {
        setUser(email); // Set the user email in the context

        // If login is successful, set the login status and redirect to "/addContact"
        navigate('/getContacts');
      } else {
        setLoginStatus(false);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setLoginStatus(false);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <input type="email" id="email" placeholder="  Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <br />
        <label>
          <input type="password" id="password" placeholder="  Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <br />
        <button type="submit">Login</button>
      </form>
      {loginStatus !== null && (
        <p>{loginStatus ? 'Login successful!' : 'Login failed. Please check your credentials.'}</p>
      )}
        <p>Don't have an account? <Link to="/register">Register</Link></p>
        <p>
            Don't have an account?{' '}
            <span onClick={handleGuestLogin} style={{ cursor: 'pointer', color: 'blue' }}>
            Guest Login
          </span>
        </p>
    </div>
  );
};

export default LoginFake;
