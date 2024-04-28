import axios from 'axios';
import React from 'react';
import SignUpForm from '../src/pages/signup';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('axios');

describe('SignUpForm', () => {
 test('submits form data correctly', async () => {
    render(<SignUpForm />);

    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Classification/i), { target: { value: 'user' } });

    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    await waitFor(() => expect(axios.post).toHaveBeenCalled());
    
    expect(axios.post).toHaveBeenCalledWith('http://localhost:8080/signup', {
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      classification: 'user',
    });
 });
});
