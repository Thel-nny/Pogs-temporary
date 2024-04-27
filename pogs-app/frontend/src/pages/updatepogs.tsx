import React, { useState, useEffect, useRef } from 'react';
import {useNavigate} from 'react-router-dom'
import axios from 'axios';

// Define the type for the form state
type Pog = {
 id: number;
 name: string;
 ticker_symbol: string;
 price: number;
 color: string;
 previous_price: number;
};

const ChangePogsForm: React.FC = () => {
 const idRef = useRef<HTMLInputElement>(null);
 const nameRef = useRef<HTMLInputElement>(null);
 const tickerSymbolRef = useRef<HTMLInputElement>(null);
 const colorRef = useRef<HTMLInputElement>(null);
  

 // Handler for form submission
 const navigate = useNavigate()
 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const id = idRef.current?.value
  const name = nameRef.current?.value;
  const tickerSymbol = tickerSymbolRef.current?.value;
  const color = colorRef.current?.value;
  try {
     const response = await axios.put(`http://localhost:8080/editPogs/${idRef}`, { 
      id: id, 
      name: name,
      ticker_symbol: tickerSymbol, 
      color: color
    }, 
      {
       headers: {
         'Content-Type': 'application/json',
       },
     });
     if (response.status === 200) {
        navigate(`/adminSide`);
      }
     alert('Pog has been updated!')
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
            <h1 className='text-2xl font-bold leading-tight tracking-tight md:text-2xl'>Update Pogs</h1>
            <form className='space-y-4 md:space-y-6' onSubmit={handleSubmit}>
            <label className='block mb-2 text-md font-medium text-gray-900'> Pog ID <input ref={idRef} className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg w-full p-2' type="text" name="id"/>
              </label>
              <label className='block mb-2 text-md font-medium text-gray-900'>Name of pog: <input ref={nameRef} className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg w-full p-2' type="text" name="name"/>
              </label>
              <label className='block mb-2 text-md font-medium text-gray-900'>Ticker Symbol: <input ref={tickerSymbolRef} className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg w-full p-2' type="text" name="ticker_symbol"/>
              </label>
              <label className='block mb-2 text-md font-medium text-gray-900'>Color: <input ref={colorRef} className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg w-full p-2' type="text" name="color"/>
              </label>
              <button className='border rounded-lg p-2 w-full text-white bg-primary-400 hover:bg-primary-900' type="submit">Submit the form</button>
            </form>
          </div>
        </div>
      </div>
    </section>
 );
};

export default ChangePogsForm;