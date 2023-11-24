// Register.js
import React, { useState } from 'react';
import axios from 'axios';

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
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <br />
        <label>
          First Name:
          <input type="text" value={fname} onChange={(e) => setFname(e.target.value)} required />
        </label>
        <br />
        <label>
          Last Name:
          <input type="text" value={lname} onChange={(e) => setLname(e.target.value)} required />
        </label>
        <br />
        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
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
