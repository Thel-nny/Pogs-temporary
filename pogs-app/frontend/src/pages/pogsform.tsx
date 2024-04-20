import React, { useState } from 'react';
import axios from 'axios'

// Define the type for the form state
type FormState = {
 name: string;
 ticker_symbol: string;
 price: number;
 color: string;
};

const PogsForm: React.FC = () => {
 // Initialize the form state
 const [formState, setFormState] = useState({
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
 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  try {
    const response = await axios.post('http://localhost:8080/pogsform', formState, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(response.data);
  } catch (error) {
    console.error('There was a problem with the axios operation:', error);
  }
};

 return (
  <section className='w-full h-screen bg-primary-100 dark:bg-gray-900'>
  <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0'>
    <div className='w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700'>
      <div className='p-6 space-y-2 md:space-y-6 sm:p-8'>
      <h1 className='text-2xl font-bold leading-tight tracking-tight md:text-2xl'> Create Pogs</h1>
    <form className='space-y-4 md:space-y-6' onSubmit={handleSubmit}>
    <label className='block mb-2 text-md font-medium text-gray-900'> Name of pog:
      <input className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg w-full p-2'
        type="text"
        name="name"
        value={formState.name}
        onChange={handleInputChange}
      />
    </label>
    <label className='block mb-2 text-md font-medium text-gray-900'>
      Ticker Symbol:
      <input className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg w-full p-2'
        type="text"
        name="ticker_symbol"
        value={formState.ticker_symbol}
        onChange={handleInputChange}
      />
    </label>
    <label className='block mb-2 text-md font-medium text-gray-900'>
      Price:
      <input className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg w-full p-2'
        type="number"
        name="price"
        value={formState.price}
        onChange={handleInputChange}
      />
    </label>
    <label className='block mb-2 text-md font-medium text-gray-900'>
      Color:
      <input className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg w-full p-2'
        type="text"
        name="color"
        value={formState.color}
        onChange={handleInputChange}
      />
    </label>
    <button className='border rounded-lg p-2 w-full text-white bg-primary-400 hover:bg-primary-900' type="submit">Submit the form</button>
  </form>
  </div>
        </div>
      </div>
    </section>
);

 }


export default PogsForm;
