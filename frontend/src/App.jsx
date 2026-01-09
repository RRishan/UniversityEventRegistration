import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Login from "./components/Login";
import Register from "./components/Register";
import Verifyotp from "./components/VerifyOtp";
import EventCreationForm from "./components/EventCreationForm";
import DashboardPage from "./Pages/DashboardPage";
import LandingPage from "./Pages/LandingPage";
import EventsPage from "./Pages/EventsPage";
import ProtectedRoute from "./ProtectedRoute";
import { UserProvider } from "./Context/UserContext";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <UserProvider>
          <BrowserRouter>
            <Routes>
              {/* Auth */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/events" element={<EventsPage />} />
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
          </BrowserRouter>
        </UserProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
