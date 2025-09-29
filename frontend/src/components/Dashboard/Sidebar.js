// src/components/Sidebar.js
import React from "react";
import { NavLink } from "react-router-dom";


export default function Sidebar() {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/events"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Events
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/profile"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Profile
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

