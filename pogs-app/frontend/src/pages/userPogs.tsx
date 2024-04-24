import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './pages.css'

interface Pog {
  id: number;
  name: string;
  ticker_symbol: string,
  price: number,
  color: string,
  user_id: number,
  previous_price: number
}

const UserPogs = () => {
  const [userPogs, setUserPogs] = useState<Pog[]>([]);
  const [pogs, setPogs] = useState<Pog[]>([]);
  const [pogsForSale, setPogsForSale] = useState<Pog[]>([]);
  const user = localStorage.getItem('userId')

  useEffect(() => {
    fetchUserPogs();
    fetchSellablePogs()
    fetchAllPogs()
  }, []);

  const fetchAllPogs = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/userPogs`);
      setPogs(response.data);
    } catch (error) {
      console.error('Error fetching all pogs:', error);
    }
 };
  const fetchUserPogs = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/userPogs/${user}`);
      setUserPogs(response.data);

    } catch (error) {
      console.error('Error fetching user pogs:', error);
    }
  };

  const fetchSellablePogs = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/pogsForSale`);
      setPogsForSale(response.data);
    } catch (error) {
      console.error('Error fetching user pogs:', error);
    }
  };

  const sellThePogs = async (pogId: number) => {
    try {
      await axios.post(`http://localhost:8080/sellPog`, { userId: user, pogId: pogId });
      fetchUserPogs();
      fetchSellablePogs();
    } catch (error: any) {
      console.error(error)
    }
  }

  return (
    <section className='w-full h-screen bg-gray-dark'>
      <div className=' flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0'>
        <div className='w-full bg-white rounded-lg'>
          <div className='p-6 space-y-2 md:space-y-6 sm:p-8'>
    <div>
      <h2>Pogs available</h2>
      <div className='marquee'>
      <ul className='marquee-content'>
        {userPogs.map(pog => (
          <li key={pog.id} className='marquee-item'>
            <h3>{pog.name}</h3>
            <p>{pog.ticker_symbol}</p>
            <p>{pog.previous_price}</p>
            <p>{pog.color}</p>
          </li>
        ))}
      </ul>
      </div>
      Pogs for Sale:
      <ul>
        {pogsForSale.map(pog => (
          <li key={pog.id} onClick={() => sellThePogs(pog.id)} style={{ cursor: 'pointer' }}>
            <h3>{pog.name}</h3>
            <p>{pog.ticker_symbol}</p>
            <p>{pog.previous_price}</p>
            <p>{pog.color}</p>
          </li>
        ))}
      </ul>
      
      <div><button  className='border rounded-lg p-2 w-full text-white bg-primary-400 hover:bg-primary-900'>Click here to buy a pog</button></div>
      <div><button  className='border rounded-lg p-2 w-full text-white bg-primary-400 hover:bg-primary-900'>Click here to sell a pog</button></div>
    </div>
    </div>
        </div>
      </div>
    </section>
  );
};

export default UserPogs;
