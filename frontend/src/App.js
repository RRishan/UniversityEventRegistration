// src/App.jsx
import React from "react";
import DashboardPage from "./Pages/DashboardPage";
import { UserProvider } from "./Context/UserContext";
import "./App.css";

function App() {
  return (
    <UserProvider>
      <DashboardPage />
    </UserProvider>
  );
}

export default App;

