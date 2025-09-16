import React from "react";
import DashboardHeader from "./DashboardHeader";
import UserStats from "./UserStats";
import RecentActivity from "./RecentActivity";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <DashboardHeader />
      <div className="dashboard-content">
        <UserStats />
        <RecentActivity />
      </div>
    </div>
  );
};

export default Dashboard;
