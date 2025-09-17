// src/components/Dashboard/Header.jsx
import React from "react";

const Header = ({ user }) => (
  <header className="dashboard-header">
    <h2>Welcome {user?.name}</h2>
  </header>
);

export default Header;

