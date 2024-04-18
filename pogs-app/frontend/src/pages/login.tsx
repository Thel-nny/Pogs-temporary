import React, { useState } from 'react';
import axios from 'axios'
import useSignIn from 'react-auth-kit/hooks/useSignIn';
import {useNavigate} from 'react-router-dom'

// Define the type for the form data
interface LoginFormData {
 email: string;
 password: string;
}

const LoginForm: React.FC = () => {
 // Initialize the form state
 
 const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '' });

 // Handler for form input changes
 const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
 };

 // Handler for form submission
 const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Here you would typically send the form data to your server
    handleLogin(formData.email, formData.password)
 };

 const navigate = useNavigate()

 const handleLogin = async (email: string, password: string) => {
  try {
    const response = await axios.post('http://localhost:8080/login', {email, password})

    if (response.status === 200) {//if user is user, go to userpogs, else go to admin page
      navigate('/userPogs')
    } else {
      alert('Login failed.')
    }
    // Handle successful login, e.g., store user data in state or local storage
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    // Handle login error, e.g., display error message to the user
  }
};


 return (
    <form onSubmit={handleSubmit}>
      <label>
        Email:
        <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
      </label>
      <br />
      <label>
        Password:
        <input type="password" name="password" value={formData.password} onChange={handleInputChange} />
      </label>
      <br />
      <button type="submit">Login</button>
      <label>
        Classification:
        <input type="text" name="classification" value={formData.password} onChange={handleInputChange} />
      </label>
      <br />
    </form>
 );
};

export default LoginForm;
