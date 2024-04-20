import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Pog {
  id: number;
  name: string;
  ticker_symbol : string,
  price: number,
  color: string,
  user_id: number,
  previous_price: number
}

const UserPogs: React.FC = () => {
  const [userPogs, setUserPogs] = useState<Pog[]>([]);

  useEffect(() => {
    fetchUserPogs();
  }, []);

  const fetchUserPogs = async () => {
    try {
      const response = await axios.get('/userPogs');
      setUserPogs(response.data);
    } catch (error) {
      console.error('Error fetching user pogs:', error);
    }
  };

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
    </div>
  );
};

export default UserPogs;
