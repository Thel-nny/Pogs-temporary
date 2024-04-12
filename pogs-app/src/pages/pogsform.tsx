import React, { useState } from 'react';

// Define the type for the form state
type FormState = {
 name: string;
 ticker_symbol: string;
 price: number;
 color: string;
};

const PogsForm: React.FC = () => {
 // Initialize the form state
 const [formState, setFormState] = useState<FormState>({
    name: '',
    ticker_symbol: '',
    price: 0,
    color: '',
 });

 // Handler for form input changes
 const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: name === 'price' ? parseFloat(value) : value,
    }));
 };

 // Handler for form submission
 const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Here you would typically send the form data to your server
    console.log(formState);
 };

 return (
    <form onSubmit={handleSubmit}>
    <label> Name of pog:
      <input
        type="text"
        name="name"
        value={formState.name}
        onChange={handleInputChange}
      />
    </label>
    <br />
    <label>
      Ticker Symbol:
      <input
        type="text"
        name="ticker_symbol"
        value={formState.ticker_symbol}
        onChange={handleInputChange}
      />
    </label>
    <br />
    <label>
      Price:
      <input
        type="number"
        name="price"
        value={formState.price}
        onChange={handleInputChange}
      />
    </label>
    <br />
    <label>
      Color:
      <input
        type="text"
        name="color"
        value={formState.color}
        onChange={handleInputChange}
      />
    </label>
    <br />
    <button type="submit">Submit the form</button>
  </form>
);

 }


export default PogsForm;
