import React, { useContext } from "react";
import { UserContext } from "../../Context/UserContext";

const DashboardHeader = () => {
  const { user } = useContext(UserContext);

  return (
    <header className="dashboard-header">
      <h2>Welcome, {user.name}</h2>
      <p>Role: {user.role}</p>
    </header>
  );
};

export default DashboardHeader;
