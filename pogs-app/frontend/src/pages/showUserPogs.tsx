import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Pog {
  id: number;
  name: string;
  ticker_symbol: string;
  price: number;
  color: string;
  user_id: number;
  previous_price: number;
}

// Define the type for the form props
const UserPogsPurchased = () =>{
  const [purchasedPogs, setPurchasedPogs] = useState<Pog[]>([])
  const user = localStorage.getItem('userId');

  useEffect(() => {
    fetchAllPurchasedPogs()
  })

  const fetchAllPurchasedPogs = async () => {
    try{
      const response = await axios.get(`http://localhost:8080/showUserPogs/${user}`);
      setPurchasedPogs(response.data)
    }catch (error) {
      console.error('Error fetching User pogs:', error);
    }
  }

  return(
    <div className="container mx-auto px-4">
      <h2>Your Pogs</h2>
      <button><a href="/userPogs">Return</a></button>
    <div className="flex flex-wrap -mx-1 lg:-mx-4">
       {purchasedPogs.map(pog => (
         <div key={pog.id} className="my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3">
           <div className="overflow-hidden rounded-lg shadow-lg">
             <div className="bg-white p-6">
               <h2 className="text-xl font-bold mb-2">{pog.name} - {pog.ticker_symbol}</h2>
               <p className="text-gray-700 text-base">
                 Price: ${pog.price}
               </p>
               <p className="text-gray-700 text-base">
                 Color: <span style={{ color: pog.color }}>{pog.color}</span>
               </p>
             </div>
             <button onClick={() => (pog.id)} className="w-full text-white bg-blue hover:bg-gray-50 font-bold py-2 px-4 rounded">
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