import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import UserPogsPurchased from "../src/pages/showUserPogs";
import { BrowserRouter as Router } from 'react-router-dom'

// Mock axios.get and axios.post
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock console.log
global.console.log = jest.fn();

describe("UserPogsPurchased", () => {

  // Mock data for purchased Pogs
  const mockPurchasedPogs = [
    {
      id: 1,
      name: "Pog 1",
      ticker_symbol: "POG1",
      price: 10,
      color: "red",
      user_id: 123,
      previous_price: 9,
      quantity: 1,
    },
    {
      id: 2,
      name: "Pog 2",
      ticker_symbol: "POG2",
      price: 15,
      color: "blue",
      user_id: 123,
      previous_price: 14,
      quantity: 1,
    },
  ];

  beforeEach(() => {
    // Mock the axios.get function to resolve with mockPurchasedPogs
    mockedAxios.get.mockResolvedValueOnce({ data: mockPurchasedPogs });
  });

  test("renders UserPogsPurchased component", async () => {
    render(
      <Router>
        <UserPogsPurchased />
      </Router>
    );

    // Wait for the purchased Pogs to be loaded
    const pog1Name = await screen.findByText("Pog 1 - POG1");
    const pog2Name = await screen.findByText("Pog 2 - POG2");

    // Assert that the purchased Pogs are rendered
    expect(pog1Name).toBeInTheDocument();
    expect(pog2Name).toBeInTheDocument();
  });

  test("handles selling Pog", async () => {
    render(
      <Router>
        <UserPogsPurchased />
      </Router>
    );

    // Wait for the purchased Pogs to be loaded
    await screen.findByText("Pog 1 - POG1");

    // Mock the axios.post function to resolve with a success response
    mockedAxios.post.mockResolvedValueOnce({});

    // Click on the Sell button for the first Pog
    const sellButton = screen.getAllByText("SELL THIS POG")[0];
    fireEvent.click(sellButton);

    // Wait for the component to update after selling the Pog
    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith("Pog successfully sold");
    });
  });

});
