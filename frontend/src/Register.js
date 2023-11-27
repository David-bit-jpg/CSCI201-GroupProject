// Register.js
import React, { useState } from 'react';
import axios from 'axios';
import './Styling.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [registrationStatus, setRegistrationStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/api/createUser', {
        username,
        password,
        fname,
        lname,
        email,
      });

      const result = response.data;

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
      {registrationStatus !== null && (
        <p>{registrationStatus ? 'Registration successful!' : 'Registration failed. Please try again.'}</p>
      )}
    </div>
  );
};

export default Register;
