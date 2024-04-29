import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import axios from "axios";
import ChangePogsForm from '../src/pages/updatepogs'; // Adjust the import path as necessary
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("ChangePogsForm", () => {
 it('should update the data correctly', async () => {
    mockedAxios.put.mockResolvedValueOnce({
      status: 200,
      data: { message: "Pog has been updated!" },
    });

    render(
      <Router>
        <ChangePogsForm />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/Pog ID/i), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText(/Name of pog/i), { target: { value: 'Example' } });
    fireEvent.change(screen.getByLabelText(/Ticker Symbol/i), { target: { value: 'EXMPL' } });
    fireEvent.change(screen.getByLabelText(/Color/i), { target: { value: 'Yellow' } });
    fireEvent.click(screen.getByRole("button", { name: "Submit the form" }));

    await waitFor(() => expect(mockedAxios.put).toHaveBeenCalledTimes(1));
    expect(window.location.pathname).toBe("/adminSide");
 });
});
