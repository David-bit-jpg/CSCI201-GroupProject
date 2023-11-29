// Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from './UserContext';
import { Link, useNavigate} from 'react-router-dom';

import './Styling.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const { setUser } = useUser();

  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [validationError, setValidationError] = useState('');
  const navigate = useNavigate();
  const validateEmail = (email) => {
    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all fields are filled in
    if (!username || !password || !fname || !lname || !email) {
      alert('Please fill in all fields.')

      setValidationError('Please fill in all fields.');
      return;
    }

    // Check if the email is valid
    if (!validateEmail(email)) {
      alert('Please enter a valid email address.')
      setValidationError('Please enter a valid email address.');
      return;
    }

    // Check if the password is at least 6 characters long
    if (password.length < 6) {
      alert('Password must be at least 6 characters long.')
      setValidationError('Password must be at least 6 characters long.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/createUser', {
        username,
        password,
        fname,
        lname,
        email,
      });

      const result = response.data;
      console.log(result.success)
      

      setRegistrationStatus(result.success);
    } catch (error) {
      console.error('Error during registration:', error);
      setRegistrationStatus(false);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <input type="text" placeholder="  Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>
        <br />
        <label>
          <input type="password" placeholder="  Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <br />
        <label>
          <input type="text" placeholder="  First Name" value={fname} onChange={(e) => setFname(e.target.value)} required />
        </label>
        <br />
        <label>
          <input type="text" placeholder="  Last Name" value={lname} onChange={(e) => setLname(e.target.value)} required />
        </label>
        <br />
        <label>
          <input type="Email" id="email" placeholder="  Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <br />
        <button type="submit">Register</button>
        
      </form>
      <p>Have an account? <Link to="/login">Login</Link></p>


      {registrationStatus !== null && (
        <p>{registrationStatus ? 'Registration successful!' : 'Registration failed. Please try again.'}</p>
      )}
    </div>
  );
};

export default Register;
