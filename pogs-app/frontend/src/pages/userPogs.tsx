import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  const [quantities, setQuantities] = useState<number[]>([]);
  const [itemsPerPage] = useState(3);
  const user = localStorage.getItem('userId');

  const indexOfLastPog = (currentPage + 1) * itemsPerPage;
  const indexOfFirstPog = indexOfLastPog - itemsPerPage;
  const currentPogs = pogsForSale.slice(indexOfFirstPog, indexOfLastPog);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const navigate = useNavigate(); 
  const logout = () => {
    // Clear the local storage data
    localStorage.clear();
    // Optionally, redirect the user to the login page
    navigate('/login');
 };

 const fetchAllPogs = async () => {
  try {
     const response = await axios.get(`http://localhost:8080/userPogs`);
     setAllPogs(response.data);
  } catch (error) {
     console.error('Error fetching all pogs:', error);
     // Optionally, set an error state to display a message to the user
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

  const userDetails = async () => {
    try {
       const response = await axios.get(`http://localhost:8080/getUserDetails/${user}`);
       setUserDetails(response.data);
    } catch (error) {
       console.error('Error fetching user details:', error);
    }
   };
   

  const handleAddQuantity = (index: number) => {
    setQuantities(prevQuantities => {
       const newQuantities = [...prevQuantities];
       newQuantities[index] = (newQuantities[index] || 0) + 1; // Ensure it's a number before incrementing
       return newQuantities;
    });
   };

   const handleMinusQuantity = (index: number) => {
    setQuantities(prevQuantities => {
       const newQuantities = [...prevQuantities];
       newQuantities[index] = Math.max((newQuantities[index] || 0) - 1, 0); // Ensure it's a number and not less than 0
       return newQuantities;
    });
   };

  const buyPog = async (pogs_id: number, quantity:number) => {
    try {
      console.log("Pogs ID: "+ pogs_id)//change logic to get quantity
      const response = await axios.post(`http://localhost:8080/buyPogs`, { pogs_id, user_id: user, quantity})
      setBoughtPogs(response.data)
      console.log('Your purchased Pog' + response.data.id)

      fetchPogsForSale();
      fetchAllPogs();
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        alert('Insufficient Balance')
      }
      console.error('Error buying pog:', error);
    }
  }

  useEffect(() => {
    fetchPogsForSale();
    fetchAllPogs();
    userDetails();
   }, [user, purchasePog]); // Add user to the dependency array
   

  return (
    <section className='md:h-screen sm:h-screen w-screen h-screen bg-gray-dark'>
      <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0'>
        <div className='w-full bg-white rounded-lg shadow'>
          <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
            <div className='display: flex; flex-wrap: wrap;'>
              {
                allUsers.map((users, index) => (
                  <ul key={index} className="display: flex flex-row ;">
                    <li className='text-lg px-3 py-2'>Name: {users.firstname}</li>
                    <li className='text-lg px-3 py-2'>User Classification: {users.classification}</li>
                    <li className='text-lg px-3 py-2'>User Wallet: {users.wallet}</li>
                  </ul>
                ))
              }
              <button className="w-50 h-10 text-white bg-blue hover:bg-red-600 font-bold py-2 px-4 rounded"><Link to="/showUserPogs">Show All Pogs Purchased</Link></button>
                <button className="ml-4 w-auto h-10 text-white bg-blue hover:bg-red font-bold py-2 px-4 rounded" onClick={logout}>
                  Log Out
                </button>
              <h2 className="mt-2 text-2xl font-bold mb-3">Pogs available</h2>
              <div className='w-full relative flex overflow-x-hidden'>
                <div className='py-2 animate-marquee'>
                    {allPogs.map(pog => (
                      <span key={pog.id} className="text-xl mx-2">{pog.ticker_symbol}|{pog.previous_price}</span>
                    ))}
                </div>
                <div className='py-2 animate-marquee2 whitespace-nowrap'>
                    {allPogs.map(pog => (
                      <span key={pog.id} className="text-xl mx-2">{pog.ticker_symbol}|{pog.previous_price}</span>
                    ))}
                </div>
            </div>
            </div>
            <h1 className="text-2xl font-bold mb-3">Pogs for Sale:</h1>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentPogs.map((pog, index) => (
                <li key={index} className="bg-white p-4 rounded-lg shadow-lg transition-shadow duration-300 ease-in-out">
                  <div className="mb-2">
                    <h4 className="text-lg font-semibold text-gray-900"><span style={{ color: pog.color }}>{pog.name} - {pog.ticker_symbol}</span></h4>
                    <p className="text-gray-600">Current Price: ${pog.price}</p>
                    <p className="text-gray-600">Previous Price: ${pog.previous_price}</p>
                    <p className="text-gray-600">Color: <span style={{ color: pog.color }}>{pog.color}</span></p>
                  </div>
                  <div className="flex justify-center space-x-2">
                        <button onClick={() => handleMinusQuantity(index)} className="px-2 py-1 border rounded-lg bg-gray-200 hover:bg-gray-300">
                            -
                        </button>
                        <span>{quantities[index] || 1}</span> 
                        <button onClick={() => handleAddQuantity(index)} className="px-2 py-1 border rounded-lg bg-gray-200 hover:bg-gray-300">
                            +
                        </button>
                      </div>
                      <button onClick={() => buyPog(pog.id, quantities[index] || 1 )} className="w-full text-white bg-blue hover:bg-gray-50 font-bold py-2 px-4 rounded">
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
