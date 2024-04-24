import React, { useState } from 'react';

interface SignUpFormState {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
   }
   
const SignUpForm: React.FC = () => {
  const [formData, setFormData] = useState({
    classification: '',
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      } else {
        await response.json();
        console.log(formData)
      }
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  return (
    <section className='w-full h-screen bg-gray-dark dark:bg-gray-900'>
      <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0'>
        <div className='w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700'>
          <div className='p-6 space-y-2 md:space-y-6 sm:p-8'>
          <h1 className='text-2xl font-bold leading-tight tracking-tight md:text-2xl'> Sign Up</h1>
    <form className='space-y-4 md:space-y-6' onSubmit={handleSubmit}>
      <label className='block mb-2 text-md font-medium text-gray-900'>
        First Name: <input className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg w-full p-2' type="text" name="firstname" value={formData.firstname} onChange={handleChange} />
      </label>
      <label className='block mb-2 text-md font-medium text-gray-900'>
        Last Name: <input className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg w-full p-2' type="text" name="lastname" value={formData.lastname} onChange={handleChange} />
      </label>
      <label className='block mb-2 text-md font-medium text-gray-900'>
        Email: <input className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg w-full p-2' type="email" name="email" value={formData.email} onChange={handleChange} />
      </label>
      <label className='block mb-2 text-md font-medium text-gray-900'>
        Password: <input className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg w-full p-2' type="password" name="password" value={formData.password} onChange={handleChange} />
      </label>
      <label className='block mb-2 text-md font-medium text-gray-900'>
        Classification: <input className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg w-full p-2'type="text" name="classification" value={formData.classification} onChange={handleChange} />
      </label>
      <button className='border rounded-lg p-2 w-full text-white bg-primary-400 hover:bg-primary-900'type="submit">Sign Up</button>
      <a className='w-full text-center mx-auto text-blue-dark hover:underline' href='/login' >Log In?</a>
    </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUpForm;
