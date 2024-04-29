import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './pages.css';
interface Pog {
  id: number;
  name: string;
  ticker_symbol: string;
  price: number;
  color: string;
  user_id: number;
  previous_price: number;
}

interface Admin {
  id: number,
  firstname: string,
  wallet: number,
  classification: string
}

const AdminSide = () => {
  const [pogsForSale, setPogsForSale] = useState<Pog[]>([]);
  const [allPogs, setAllPogs] = useState<Pog[]>([]);
  const [allUsers, setUserDetails] = useState<Admin[]>([]);
  const [purchasePog, setBoughtPogs] = useState<Admin[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(4);
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
      const response = await axios.get(`http://localhost:8080/getUserDetails/${user}`)
      setUserDetails(response.data);
    } catch (error) {
      console.error('Error fetching pogs for sale:', error);
    }
  };

  const DeletePog = async (pogId: number) => {
    try {
      await axios.delete(`http://localhost:8080/adminSide/${pogId}`);
      fetchAllPogs();
      fetchPogsForSale();
    } catch (error) {
      console.error('Error deleting pog:', error);
    }
  };

  const changePrice = async () => {
    try {
      await axios.patch('http://localhost:8080/changePrice')
      fetchAllPogs()
      fetchPogsForSale()
      alert('Price changed')
    }catch (error) {
      console.error('Error changing price:', error);
    }
  }

  useEffect(() => {
    fetchPogsForSale();
    fetchAllPogs();
    userDetails()
  }, [purchasePog]);

  return (
    <section className='md:h-screen sm:h-screen w-screen h-screen bg-gray-Dark'>
      <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0'>
        <div className='w-full bg-white rounded-lg shadow'>
          <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
            <div className='flex flex-wrap'>
              {
                allUsers.map((users, index) => (
                 <ul key={index} className="flex flex-row">
                    <li className='text-lg font-bold px-3 py-2'>Name: {users.firstname}</li>
                    <li className='text-lg font-bold ml-5 px-3 py-2'>User Classification: {users.classification}</li>
                 </ul>
                ))
              }
              <div className='flex justify-between items-center w-full'>
                <button className="w-auto h-10 text-white bg-blue font-bold py-2 px-4 rounded">
                    <Link to="/pogsform">Create New Pogs</Link>
                </button>
                <button className="w-auto h-10 text-white bg-blue font-bold py-2 px-4 rounded" onClick={changePrice}>
                    Trigger Price Change
                </button>
                <button className="ml-4 w-auto h-10 text-white bg-blue hover:bg-red font-bold py-2 px-4 rounded" onClick={logout}>
                  Log Out
                </button>
              </div>
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
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {currentPogs.map((pog, index) => (
                <li key={index} className="bg-white p-2 sm:p-4 rounded-lg shadow-lg transition-shadow duration-300 ease-in-out">
                 <div className="mb-2">
                 <h4 className="text-sm sm:text-lg font-semibold text-gray-900"><span style={{ color: pog.color }}>{pog.name} - {pog.ticker_symbol}</span></h4>
                    <p className="text-gray-600">Pog Id: {pog.id}</p>
                    <p className="text-gray-600">Current Price: ${pog.price}</p>
                    <p className="text-gray-600">Previous Price: ${pog.previous_price}</p>
                    <p className="text-gray-600">Color: <span style={{ color: pog.color }}>{pog.color}</span></p>
                 </div>
                 <button onClick={() => DeletePog(pog.id)} className="button"> Delete </button> 
                      <button className="w-full sm:w-auto text-white bg-blue hover:bg-gray-50 font-bold py-2 px-4 rounded"><Link to="/updatepogs">
                         Edit this Pog
                         </Link>
                        </button>
                </li>
              ))}
            </ul>
            <div className="flex justify-center space-x-4" >
              {Array.from({ length: Math.ceil(pogsForSale.length / itemsPerPage) }, (_, i) => (
                <button key={i} onClick={() => paginate(i)} className="px-4 py-2 border rounded-lg bg-primary-400 text-white hover:bg-primary-500" data-testid="page-button">
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

export default AdminSide;
