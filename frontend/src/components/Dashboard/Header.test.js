// src/tests/Header.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import Header from "./Header";
import { UserProvider } from "../../Context/UserContext";

test("renders welcome message with user name", () => {
  render(
    <UserProvider>
      <Header />
    </UserProvider>
  );

  const welcomeMessage = screen.getByText(/welcome/i);
  expect(welcomeMessage).toBeInTheDocument();
});
