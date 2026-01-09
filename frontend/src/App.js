import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import Verifyotp from "./components/Verifyotp";
import EventCreationForm from "./components/EventCreationForm";
import DashboardPage from "./Pages/DashboardPage";
import LandingPage from "./Pages/LandingPage";
import ProtectedRoute from "./ProtectedRoute";
import { UserProvider } from "./Context/UserContext";

function App() {
  return (
    <UserProvider>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<Verifyotp />} />

        {/* Protected */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />

        <Route path="/events/register" element={
          <ProtectedRoute>
            <EventCreationForm />
          </ProtectedRoute>
        } />
      </Routes>
    </UserProvider>
  );
}

export default App;
