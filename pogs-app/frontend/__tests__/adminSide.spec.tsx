import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import axios from 'axios';
import AdminSide from '../src/pages/adminSide';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AdminSide', () => {
 test('renders AdminSide component', () => {
    render(
      <Router>
        <AdminSide />
      </Router>
    );

    expect(screen.getByText(/Pogs available/i)).toBeInTheDocument();
 });

 test('navigates to /pogsform when "Create New Pogs" button is clicked', () => {
    const { getByText } = render(
      <Router>
        <AdminSide />
      </Router>
    );

    const createNewPogsButton = screen.getByText(/Create New Pogs/i);
    fireEvent.click(createNewPogsButton);
    expect(window.location.pathname).toBe('/pogsform');
 });

 test('calls changePrice function when "Trigger Price Change" button is clicked', async () => {
    const { getByText } = render(
      <Router>
        <AdminSide />
      </Router>
    );

    const triggerPriceChangeButton = screen.getByText(/Trigger Price Change/i);
    fireEvent.click(triggerPriceChangeButton);
    mockedAxios.patch.mockResolvedValue({});

    await waitFor(() => expect(mockedAxios.patch).toHaveBeenCalled());
 });

 test('logs out and navigates to /login when "Log Out" button is clicked', () => {
    const { getByText } = render(
      <Router>
        <AdminSide />
      </Router>
    );

    const logOutButton = screen.getByText(/Log Out/i);
    fireEvent.click(logOutButton);

    
    expect(localStorage.getItem('userId')).toBeNull();

   
    expect(window.location.pathname).toBe('/login');
 });

 test('pagination updates displayed pogs', async () => {
    const { getByText } = render(
      <Router>
        <AdminSide />
      </Router>
    );

  
    const nextPageButton = screen.getByText(/2/i);
    fireEvent.click(nextPageButton);

    
    await expect(screen.findByText(/First pog on page 2/i)).resolves.toBeInTheDocument();
 });
});
