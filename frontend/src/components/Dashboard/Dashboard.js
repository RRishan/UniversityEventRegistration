// src/components/Dashboard/Dashboard.jsx
import React, { useContext } from "react";
import { UserContext } from "../../Context/UserContext";
import Sidebar from "./Sidebar";
import Header from "./Header";
import EventList from "./EventList";

const Dashboard = () => {
  const { user } = useContext(UserContext);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main">
        <Header user={user} />
        <EventList />
      </div>
    </div>
  );
};

export default Dashboard;

