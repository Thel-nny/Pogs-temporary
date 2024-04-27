import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios, { Axios } from 'axios';

interface Pog {
  id: number;
  name: string;
  ticker_symbol: string;
  price: number;
  color: string;
  user_id: number;
  previous_price: number;
  quantity: number;
}
const UserPogsPurchased = () => {
  const [purchasedPogs, setPurchasedPogs] = useState<Pog[]>([])
  const user = localStorage.getItem('userId');

  useEffect(() => {
    fetchAllPurchasedPogs();
  }, [purchasedPogs]);

  const fetchAllPurchasedPogs = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/showUserPogs/${user}`);
      setPurchasedPogs(response.data)
    } catch (error) {
      console.error('Error fetching User pogs:', error);
    }
  }

  const sellPog = async (pogId: number) => {
    try {
       const response = await axios.post(`http://localhost:8080/sellPog`, 
       { user_id: user, pogs_id: pogId, quantity: 1 });
       // Assuming the response contains the updated Pog information
       // If the quantity is less than 1 after selling, remove it from the list
       const updatedPog = response.data;
       if (updatedPog.quantity > 1) {
         setPurchasedPogs(purchasedPogs.filter(pog => pog.id !== pogId));
       } else {
         // If the quantity is not less than 1, update the quantity in the list
         setPurchasedPogs(purchasedPogs.map(pog => 
           pog.id === pogId ? { ...pog, quantity: updatedPog.quantity } : pog
         ));
       }
    } catch (error: any) {
       if (error.response && error.response.status === 400) {
         alert('Quantity of Pogs is 0.');
       }
       console.error('Error selling pog:', error);
    }
   };
   
   
  return (
    <div className="container mx-auto px-4">
      <h2>Your Pogs</h2>
      <button><Link to="/userPogs">Return</Link></button>
      <div className="flex flex-wrap -mx-1 lg:-mx-4">
        {purchasedPogs.map((pog, index) => (
          <div key={index} className="my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3">
            <div className="overflow-hidden rounded-lg shadow-lg">
              <div className="bg-white p-6">
                <h2 className="text-xl font-bold mb-2"><span style={{ color: pog.color }}>{pog.name} - {pog.ticker_symbol}</span></h2>
                <p className="text-gray-700 text-base">
                  Price: ${pog.price}
                </p>
                <p className="text-gray-700 text-base">
                  Color: <span style={{ color: pog.color }}>{pog.color}</span>
                </p>
                <p className='text-gray-700 text-base'>
                  Quantity: {pog.quantity}
                </p>
              </div>
              <button onClick={async () => await sellPog(pog.id)} className="w-full text-white bg-blue hover:bg-gray-50 font-bold py-2 px-4 rounded">
                SELL THIS POG
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UserPogsPurchased