import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import CreateProfile from "./pages/CreateProfile";
import OrganizerProfile from "./pages/OrganizerProfile";
import StudentProfile from "./pages/StudentProfile";
import LecturerProfile from "./pages/LecturerProfile";
import Home from "./pages/Home";
import Events from "./pages/Events";
import MyEvents from "./pages/MyEvents";
import EventRegistration from "./pages/EventRegistration";
import EventDetail from "./pages/EventDetail";
import ApprovalDashboard from "./pages/ApprovalDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";
import { AppContextProvider } from "./context/AppContext";

const queryClient = new QueryClient();

const App = () => (
  <AppContextProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/sign-in" replace />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/create-profile" element={<CreateProfile />} />
            <Route path="/profile" element={<OrganizerProfile />} />
            <Route path="/profile/organizer" element={<OrganizerProfile />} />
            <Route path="/profile/student" element={<StudentProfile />} />
            <Route path="/profile/lecturer" element={<LecturerProfile />} />
            <Route path="/home" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/my-events" element={<MyEvents />} />
            <Route path="/event-registration" element={<EventRegistration />} />
            <Route path="/event/:id" element={<EventDetail />} />
            <Route path="/approval-dashboard" element={<ApprovalDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </AppContextProvider>
);

export default App;
