import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import UserPogs from "../src/pages/userPogs";

// Mock axios.get
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock console.log
global.console.log = jest.fn();

describe("UserPogs", () => {
  // Define mock data for axios.get
  const mockData = {
    data: [
      {
        id: 1,
        name: "Pog 1",
        ticker_symbol: "POG1",
        price: 10,
        color: "red",
        previous_price: 9,
      },
      {
        id: 2,
        name: "Pog 2",
        ticker_symbol: "POG2",
        price: 15,
        color: "blue",
        previous_price: 14,
      },
    ],
  };

  beforeEach(() => {
    // Mock the axios.get function to resolve with mockData
    mockedAxios.get.mockResolvedValueOnce(mockData);
  });

  test("renders UserPogs component", async () => {
    // Render the component wrapped in MemoryRouter since it uses react-router-dom
    render(
      <MemoryRouter>
        <UserPogs />
      </MemoryRouter>
    );

    // Wait for the data to be loaded
    const pog1Name = await screen.findByText("Pog 1 - POG1");
    const pog2Name = await screen.findByText("Pog 2 - POG2");

    // Assert that the pog names are rendered
    expect(pog1Name).toBeInTheDocument();
    expect(pog2Name).toBeInTheDocument();

    // Assert that the Buy buttons are rendered
    const buyButtons = screen.getAllByText("Buy this Pog");
    expect(buyButtons).toHaveLength(2);
  });

  test("handles buy button click", async () => {
    render(
      <MemoryRouter>
        <UserPogs />
      </MemoryRouter>
    );

    // Wait for the data to be loaded
    await screen.findByText("Pog 1 - POG1");

    // Mock the axios.post function to resolve with a success response
    mockedAxios.post.mockResolvedValueOnce({});

    // Click on the Buy button for the first Pog
    const buyButton = screen.getAllByText("Buy this Pog");
    fireEvent.click(buyButton[0]);

    // check console for success message'
    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith(
        "Pogs ID: " + mockData.data[0].id
      );
    });

    // Assert that the axios.post function was called with the correct arguments
    // expect(axios.post).toHaveBeenCalledWith("http://localhost:8080/buyPogs", {
    //   pogs_id: 1,
    //   quantity: 1,
    //   user_id: 1
    // });

    // Wait for the data to be reloaded after the purchase
    const pog1NameAfterPurchase = await screen.findByText("Pog 1 - POG1");

    // Assert that the pog name is still rendered after the purchase
    expect(pog1NameAfterPurchase).toBeInTheDocument();
  });
});
