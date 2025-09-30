// src/components/Dashboard/Dashboard.jsx
import React, { useContext } from "react";
import { useUserContext } from "../../Context/UserContext";
import Sidebar from "./Sidebar";
import Header from "./Header";
import EventList from "./EventList";

const Dashboard = () => {
  const { user, events } = useUserContext();


  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main">
        <Header user={user} />
        <EventList events={events} />

      </div>
    </div>
  );
};

export default Dashboard;

