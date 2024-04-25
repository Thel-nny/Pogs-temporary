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

interface User {
  id: number,
  firstname: string,
  wallet: number,
  classification: string
}

const UserPogs = () => {
  const [userPogs, setUserPogs] = useState<Pog[]>([]);
  const [pogsForSale, setPogsForSale] = useState<Pog[]>([]);
  const [allPogs, setAllPogs] = useState<Pog[]>([]);
  const [allUsers, setUserDetails] = useState<User[]>([]);
  const [purchasePog, setBoughtPogs] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(6);
  const user = localStorage.getItem('userId');

  useEffect(() => {
    fetchUserPogs();
    fetchPogsForSale();
    fetchAllPogs();
    userDetails()
  }, []);

  const fetchAllPogs = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/userPogs`);
      setAllPogs(response.data);
    } catch (error) {
      console.error('Error fetching all pogs:', error);
    }
  };

  const fetchUserPogs = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/userPogs/${user}`);
      setUserPogs(response.data);
      console.log("User details:" + response.data)
    } catch (error) {
      console.error('Error fetching user pogs:', error);
    }
  };

  const fetchPogsForSale = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/pogsForSale`);
      setPogsForSale(response.data);
    } catch (error) {
      console.error('Error fetching pogs for sale:', error);
    }
  };

  const sellPog = async (pogId: number) => {
    try {
      await axios.post(`http://localhost:8080/sellPog`, { userId: user, pogId });
      fetchUserPogs();
      fetchPogsForSale();
    } catch (error) {
      console.error('Error selling pog:', error);
    }
  };

  const userDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/getUserDetails/${user}`)
      setUserDetails(response.data);
    } catch (error) {
      console.error('Error fetching pogs for sale:', error);
    }
  };

  const buyPog = async (pogId: number) => {
    try {
      const response = await axios.post(`http://localhost:8080/buyPog`, { pogId, userId: user })
      setBoughtPogs(response.data)
      console.log('Your bought pog:' + response.data.name)
      fetchUserPogs();
      fetchPogsForSale();
      fetchAllPogs();
    } catch (error: any) {
      console.error(error)
    }
  }

  const indexOfLastPog = (currentPage + 1) * itemsPerPage;
  const indexOfFirstPog = indexOfLastPog - itemsPerPage;
  const currentPogs = pogsForSale.slice(indexOfFirstPog, indexOfLastPog);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  return (
    <section className='md:h-screen sm:h-screen w-screen h-screen bg-gray-dark'>
      <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0'>
        <div className='w-full bg-white rounded-lg shadow'>
          <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
            <div className='display: flex; flex-wrap: wrap;'>
              {
                allUsers.map(users => (
                  <ul key={users.id} className="display: flex;">
                    <li className='text-lg px-3 py-2'>Name: {users.firstname}</li>
                    <li className='text-lg px-3 py-2'>User Classification:{users.classification}</li>
                    <li className='text-lg px-3 py-2'>User Wallet: {users.wallet}</li>
                  </ul>
                ))
              }
              <button><a className='text-blue-dark hover:underline' href='/showUserPogs'>Show All Pogs Purchased</a></button>
            </div>
            <h2 className="text-2xl font-bold mb-3">Pogs available</h2>
            <div className='overflow-x-hidden whitespace-nowrap'>
              <div className='py-6 animate-marquee'>
                {allPogs.map(pog => (
                  <span key={pog.id} className="text-4xl mx-4">{pog.ticker_symbol}|{pog.previous_price}</span>
                ))}
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-3">Pogs for Sale:</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentPogs.map(pog => (
                <li key={pog.id} className="bg-white p-4 rounded-lg shadow-lg transition-shadow duration-300 ease-in-out">
                  <div className="mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">{pog.name} - {pog.ticker_symbol}</h4>
                    <p className="text-gray-600">Current Price: ${pog.price}</p>
                    <p className="text-gray-600">Previous Price: ${pog.previous_price}</p>
                    <p className="text-gray-600">Color: <span style={{ color: pog.color }}>{pog.color}</span></p>
                  </div>
                  <button onClick={() => buyPog(pog.id)} className="w-full text-white bg-blue hover:bg-gray-50 font-bold py-2 px-4 rounded">
                    Buy this Pog
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex justify-center space-x-4">
              {Array.from({ length: Math.ceil(pogsForSale.length / itemsPerPage) }, (_, i) => (
                <button key={i} onClick={() => paginate(i)} className="px-4 py-2 border rounded-lg bg-primary-400 text-white hover:bg-primary-500">
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserPogs;
