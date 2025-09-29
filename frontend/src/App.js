// src/App.jsx
import React from "react";
import DashboardPage from "./Pages/DashboardPage";
import { UserProvider } from "./Context/UserContext";
import "./App.css";

// Banula
import Register from "./components/Register";
import Login from "./components/Login";


function App() {
  return (
    <><UserProvider>
      <DashboardPage />
    </UserProvider>

    
    <Register />
    <Login /></>
  );
}

export default App;

