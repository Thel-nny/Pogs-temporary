import React, { useState, useEffect } from 'react';
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
 const [currentData, setCurrentData] = useState<Pog | null>(null);
 const [showPriceInput, setShowRandomPrice] = useState(false);
  const id = localStorage.getItem('id');

  useEffect(() => {
   if (id) {
      const fetchCurrentData = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/pogs/${id}`);
          setCurrentData(response.data);
        } catch (error) {
          console.error('Failed to fetch current data:', error);
        }
      };
  
      fetchCurrentData();
   }
  }, [id]); // Add pogs as a dependency to re-run the effect if it changes
  

 // Handler for form submission
 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/ChangePogsForm', { price: currentData?.price }, {
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
            <h1 className='text-2xl font-bold leading-tight tracking-tight md:text-2xl'>Create Pogs</h1>
            <form className='space-y-4 md:space-y-6' onSubmit={handleSubmit}>
            <label className='block mb-2 text-md font-medium text-gray-900'> Input Pog ID <input className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg w-full p-2' type="text" name="firstname"/>
              </label>
              <label className='block mb-2 text-md font-medium text-gray-900'>Name of pog: <span className='ml-2 text-gray-500'>{currentData?.name}</span>
              </label>
              <label className='block mb-2 text-md font-medium text-gray-900'>Ticker Symbol: <span className='ml-2 text-gray-500'>{currentData?.ticker_symbol}</span>
              </label>
              <label className='block mb-2 text-md font-medium text-gray-900'>Color:
                <span className='ml-2 text-gray-500'>{currentData?.color}</span>
              </label>
              <button className='border rounded-lg p-2 w-full text-white bg-primary-400 hover:bg-primary-900' type="button" onClick={() => setShowRandomPrice(!showPriceInput)}>Change Price</button>
            </form>
          </div>
        </div>
      </div>
    </section>
 );
};

export default ChangePogsForm;
