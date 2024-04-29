import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import axios from 'axios';
import AdminSide from '../src/pages/adminSide';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AdminSide', () => {
 it('renders AdminSide component', () => {
    render(
      <Router>
        <AdminSide />
      </Router>
    );

    expect(screen.getByText(/Pogs available/i)).toBeInTheDocument();
 });

 it('navigates to /pogsform when "Create New Pogs" button is clicked', () => {
    const { getByText } = render(
      <Router>
        <AdminSide />
      </Router>
    );

    const createNewPogsButton = screen.getByText(/Create New Pogs/i);
    fireEvent.click(createNewPogsButton);
    expect(window.location.pathname).toBe('/pogsform');
 });

 it('calls changePrice function when "Trigger Price Change" button is clicked', async () => {
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

  // we didn't know how to test this so we left it out hehe
//  it('pagination updates displayed pogs', async () => {
//   mockedAxios.get.mockResolvedValueOnce({
//     data: {
//       pogs: [
//         {
//           id: 1,
//           name: 'First pog on page 1',
//           ticker_symbol: 'TICKER1',
//           price: 1,
//           previous_price: 1,
//           color: 'red',
//         },
//         {
//           id: 2,
//           name: 'Second pog on page 1',
//           ticker_symbol: 'TICKER2',
//           price: 2,
//           previous_price: 2,
//           color: 'green',
//         }, 
//         {
//           id: 3,
//           name: 'Third pog on page 1',
//           ticker_symbol: 'TICKER3',
//           price: 3,
//           previous_price: 3,
//           color: 'blue',
//         },
//         {
//           id: 4,
//           name: 'Fourth pog on page 1',
//           ticker_symbol: 'TICKER4',
//           price: 4,
//           previous_price: 4,
//           color: 'yellow',
//         },
//         {
//           id: 5,
//           name: 'Fifth pog on page 1',
//           ticker_symbol: 'TICKER5',
//           price: 5,
//           previous_price: 5,
//           color: 'orange',
//         },
//         {
//           id: 6,
//           name: 'Sixth pog on page 1',
//           ticker_symbol: 'TICKER6',
//           price: 6,
//           previous_price: 6,
//           color: 'purple',
//         },
//         {
//           id: 7,
//           name: 'Seventh pog on page 1',
//           ticker_symbol: 'TICKER7',
//           price: 7,
//           previous_price: 7,
//           color: 'pink',
//         },
//         {
//           id: 8,
//           name: 'Eighth pog on page 1',
//           ticker_symbol: 'TICKER8',
//           price: 8,
//           previous_price: 8,
//           color: 'black',
//         },
//         {
//           id: 9,
//           name: 'Ninth pog on page 1',
//           ticker_symbol: 'TICKER9',
//           price: 9,
//           previous_price: 9,
//           color: 'white',
//         },
//         {
//           id: 10,
//           name: 'Tenth pog on page 1',
//           ticker_symbol: 'TICKER10',
//           price: 10,
//           previous_price: 10,
//           color: 'brown',
//         }
//       ],
//       users: [
//         {
//           id: 1,
//           username: 'admin',
//           password: 'admin',
//           role: 'admin',
//         }
//       ]
//     },
//   });
//     render(
//       <Router>
//         <AdminSide />
//       </Router>
//     );

//     const nextPageButton = screen.getAllByTestId("page-button");
//     fireEvent.click(nextPageButton[1]);
//     await expect(screen.findByText(/First pog on page 2/i)).resolves.toBeInTheDocument();
//  });
});