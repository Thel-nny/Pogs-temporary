import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
  const [pogsForSale, setPogsForSale] = useState<Pog[]>([]);
  const user = localStorage.getItem('userId')

  useEffect(() => {
    fetchUserPogs();
    fetchSellablePogs()
  }, []);

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
    <div>
      <h2>User's Pogs</h2>
      <ul>
        {userPogs.map(pog => (
          <li key={pog.id}>
            <h3>{pog.name}</h3>
            <p>{pog.ticker_symbol}</p>
            <p>{pog.previous_price}</p>
            <p>{pog.color}</p>
          </li>
        ))}
      </ul>
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
      
      <div><button>Click here to buy a pog</button></div>
      <div><button>Click here to sell a pog</button></div>
    </div>
  );
};

export default UserPogs;
