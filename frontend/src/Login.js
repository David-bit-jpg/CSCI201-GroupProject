import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Make sure to install axios using `npm install axios` or `yarn add axios`
import { useUser } from './UserContext';
import './Styling.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState(null);
  const { setUser } = useUser();

  const navigate = useNavigate(); // useNavigate hook for programmatic navigation


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
    </div>
  );
};

export default Login;
