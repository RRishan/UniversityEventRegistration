// src/App.jsx
import React from "react";
import DashboardPage from "./Pages/DashboardPage";
import { UserProvider } from "./Context/UserContext";
import "./App.css";

// Banula
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import EventCreationForm from "./components/EventCreationForm";
import Login from "./components/Login";


function App() {
  return (
    <>
      <Router>
        <nav style={{ padding: "10px", background: "#eee" }}>
          <Link to="/events/register">Register Event</Link>
        </nav>

        <Routes>
          <Route path="/events/register" element={<EventCreationForm />} />
        </Routes>
      </Router>

      <UserProvider>
        <DashboardPage />
      </UserProvider>

      <Login />
    </>
  );
}

export default App;

