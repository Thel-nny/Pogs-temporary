import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import axios from "axios";
import Login from "../src/pages/login";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

beforeEach(() => {
  mockedAxios.get.mockResolvedValueOnce({
    userId: 1,
  });
});

describe("should handle logins", () => {
  it("should handle valid email and password for user", async () => {

    const mockedAxios = axios as jest.Mocked<typeof axios>;
    mockedAxios.post.mockResolvedValueOnce({
      status: 200,
      data: {
        user: {
          id: 1,
          classification: "user",
        },
      },
    });

    render(
      <Router>
        <Login />
      </Router>
    );

    const email = screen.getByLabelText("Email:");
    const password = screen.getByLabelText("Password:");

    fireEvent.change(email, { target: { value: "email@testing.com" } });
    fireEvent.change(password, { target: { value: "password" } });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(window.location.pathname).toBe("/userPogs");
    });
  });

  it('should handle valid email and password for admin', async () => {

    const mockedAxios = axios as jest.Mocked<typeof axios>;
    mockedAxios.post.mockResolvedValueOnce({
      status: 200,
      data: {
        user: {
          id: 1,
          classification: "admin",
        },
      },
    });

    render(
      <Router>
        <Login />
      </Router>
    );

    const email = screen.getByLabelText("Email:");
    const password = screen.getByLabelText("Password:");

    fireEvent.change(email, { target: { value: "admin@example.com" } });
    fireEvent.change(password, { target: { value: "password" } });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(window.location.pathname).toBe("/adminSide");
    });
  });

  it("should handle empty field email and password", async () => {

    render(
      <Router>
        <Login />
      </Router>
    );

    const email = screen.getByLabelText("Email:");
    const password = screen.getByLabelText("Password:");

    fireEvent.change(email, { target: { value: "" } });
    fireEvent.change(password, { target: { value: "" } });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      // this signifies that the page has been refreshed
      expect(window.location.pathname).toBe("/login");
    });
  });
});
