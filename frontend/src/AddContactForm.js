import React, { useState } from 'react';

const AddContactForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fname: '',
    lname: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/api/addContact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log(result); // Handle the response as needed
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
      </label>

      <br />

      <label>
        Email:
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </label>

      <br />

      <label>
        First Name:
        <input
          type="text"
          name="fname"
          value={formData.fname}
          onChange={handleChange}
        />
      </label>

      <br />

      <label>
        Last Name:
        <input
          type="text"
          name="lname"
          value={formData.lname}
          onChange={handleChange}
        />
      </label>

      <br />

      <button type="submit">Submit</button>
    </form>
  );
};

export default AddContactForm;
