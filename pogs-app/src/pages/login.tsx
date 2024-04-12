import React, { useState } from 'react';

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
    console.log(formData);
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
    </form>
 );
};

export default LoginForm;
