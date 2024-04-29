import axios from "axios";
import React from "react";
import SignUpForm from "../src/pages/signup";
import { BrowserRouter as Router } from "react-router-dom";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("SignUpForm", () => {
  test("submits form data correctly", async () => {

    mockedAxios.post.mockResolvedValueOnce({
      data: {
        message: "User created successfully",
      },
      status: 200,
    });

    render(
      <Router>
        <SignUpForm />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText(/Last Name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText(/Classification/i), {
      target: { value: "user" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    await waitFor(() => {
      expect(window.location.pathname).toBe("/login");
    });
  }); //add more test cases

  test("handle error", async () => {
    render(
    <Router>
      <SignUpForm />
    </Router>);

    fireEvent.change(screen.getByLabelText(/First Name/i), {
      // missing value: first name
      target: { value: "" },
    });
    fireEvent.change(screen.getByLabelText(/Last Name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText(/Classification/i), {
      target: { value: "user" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    await waitFor(() => expect(window.location.pathname).toBe("/nonexistent-page"));
  });
});
