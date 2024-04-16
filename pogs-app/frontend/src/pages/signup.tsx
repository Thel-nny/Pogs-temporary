import React, { useState } from 'react';

const SignUpForm: React.FC = () => {
  const [formData, setFormData] = useState({
    classification: '',
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      } else {
        await response.json();
        // Assuming the response contains a token
        alert('Signup successful!');
      }
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        First Name:
        <input type="text" name="firstname" value={formData.firstname} onChange={handleChange} />
      </label>
      <br />
      <label>
        Last Name:
        <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} />
      </label>
      <br />
      <label>
        Email:
        <input type="email" name="email" value={formData.email} onChange={handleChange} />
      </label>
      <br />
      <label>
        Password:
        <input type="password" name="password" value={formData.password} onChange={handleChange} />
      </label>
      <br />
      <label>
        Classification:
        <input type="password" name="classification" value={formData.classification} onChange={handleChange} />
      </label>
      <br />
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignUpForm;
