import React, { useState } from 'react';
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

// Define the type for the form data
interface LoginFormData {
 email: string;
 password: string;
 classification: string
}

const LoginForm: React.FC = () => {
 
 const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '', classification: '' });

 const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
 };

 const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleLogin(formData.email, formData.password, formData.classification)
 };

 const navigate = useNavigate()

 const handleLogin = async (email: string, password: string, classification: string) => {
  try {

    if (email === '' || password === '' || !email || !password) {
      alert('Please fill in all fields')
      navigate('/login')
    }

     const response = await axios.post('http://localhost:8080/login', {email, password, classification})
     console.log(response.data)
     if (response.status === 200) {
       localStorage.setItem('userId', response.data.user.id);
       if (response.data.user.classification === 'admin') {
         navigate(`/adminSide`);
       } else {
         navigate(`/userPogs`);
       }
     } else {
      alert('Invalid email or password')
     }
  } catch (error) {
     console.error('There was a problem with the fetch operation:', error);
  }
 };
 
 return (
  <section className=' w-full h-screen bg-gray-dark dark:bg-gray-900'>
    <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0'>
      <div className='w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700'>
        <div className='p-6 space-y-2 md:space-y-6 sm:p-8'>
          <h1 className='text-2xl font-bold leading-tight tracking-tight md:text-2xl'> Log In</h1>
          <form className='space-y-4 md:space-y-6' onSubmit={handleSubmit}>
        <label className='block mb-2 text-md font-medium text-gray-900'>
        Email: <input className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg w-full p-4 mb-2' type="email" name="email" value={formData.email} onChange={handleInputChange}/>
        </label>
        <label className='block mb-2 text-md font-medium text-gray-900'>
        Password: <input className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg w-full p-4' type= "password" name="password" value={formData.password} onChange={handleInputChange}/>
        </label>
        <button className='border rounded-lg p-2 w-full text-white bg-primary-400 hover:bg-primary-900' type="submit" >Login</button>
        <a className='text-blue-dark hover:underline' href='/signup'>Don't have an account? Make a new one</a>
      <br />
    </form>
      </div>
      </div>
     </div>
    </section>
 );
};

export default LoginForm;
