import React, { useState } from 'react';

// Define the type for the form data
interface FormData {
 name: string;
 age: number;
}

// Define the type for the form props

const Form: React.FC = () => {
 // Initialize the form state
 const [formData, setFormData] = useState<FormData>({ name: '', age: 0 });

 // Handler for form input changes
 const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: name === 'age' ? parseInt(value) : value });
 };

 // Handler for form submission
 const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
 };

 return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
      </label>
      <br />
      <label>
        Age:
        <input type="number" name="age" value={formData.age} onChange={handleInputChange} />
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
 );
};

export default Form;
