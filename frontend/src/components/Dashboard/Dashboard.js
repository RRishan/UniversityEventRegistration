// src/components/Dashboard/Dashboard.jsx
import React from "react";
import { useUserContext } from "../../Context/UserContext";
import Sidebar from "./Sidebar";
import Header from "./Header";
import EventList from "./EventList";

const Dashboard = () => {
  const { user, events, loading, error } = useUserContext();

  return (
    <div className="dashboard-container">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Section */}
      <div className="dashboard-main">
        <Header user={user} />

        {loading && <div className="spinner">Loading events...</div>}
        {error && <div className="error">{error}</div>}
        {!loading && !error && <EventList events={events} />}
      </div>
    </div>
  );
};

export default Dashboard;


