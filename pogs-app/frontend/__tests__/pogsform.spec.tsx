import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import axios from "axios";
import PogsForm from "../src/pages/pogsform";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("PogsForm", () => {
  it("should successfully add a pog", async () => {
    mockedAxios.get.mockRejectedValueOnce({
      response: {
        status: 200,
      },
    });

    render(
      <Router>
        <PogsForm />
      </Router>
    );

    const pogNameInput = screen.getByLabelText("Name of pog:");
    const tickerSymbolInput = screen.getByLabelText("Ticker Symbol:");
    const priceInput = screen.getByLabelText("Price:");
    const color = screen.getByLabelText("Color:");

    const submitButton = screen.getByRole("button", {
      name: "Submit the form",
    });

    fireEvent.change(pogNameInput, { target: { value: "Pog 1" } });
    fireEvent.change(tickerSymbolInput, { target: { value: "POG1" } });
    fireEvent.change(priceInput, { target: { value: 100 } });
    fireEvent.change(color, { target: { value: "red" } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(window.location.pathname).toBe("/adminSide");
    });
  });

  it("should fail to add a pog", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      response: {
        status: 404,
      },
    });

    render(
      <Router>
        <PogsForm />
      </Router>
    );

    const pogNameInput = screen.getByLabelText("Name of pog:");
    const tickerSymbolInput = screen.getByLabelText("Ticker Symbol:");
    const priceInput = screen.getByLabelText("Price:");
    const color = screen.getByLabelText("Color:");

    const submitButton = screen.getByRole("button", {
      name: "Submit the form",
    });
    fireEvent.change(pogNameInput, { target: { value: "" } });
    fireEvent.change(tickerSymbolInput, { target: { value: "POG1" } });
    fireEvent.change(priceInput, { target: { value: 100 } });
    fireEvent.change(color, { target: { value: "red" } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(window.location.pathname).toBe("/nonexistent-page"); // Update this to the correct pathname
    });
  });
});
