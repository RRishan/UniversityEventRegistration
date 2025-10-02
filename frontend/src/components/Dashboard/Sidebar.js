// src/components/Dashboard/Sidebar.jsx
import React from "react";
import { useUserContext } from "../../Context/UserContext";

export default function Sidebar() {
  const { events } = useUserContext();

  return (
    <aside className="sidebar">
      <h2>Filters</h2>
      <input type="text" placeholder="Search events..." />
      <select>
        <option>All</option>
        <option>Music</option>
        <option>Educational</option>
        <option>Entertainment</option>
        <option>Meetings</option>
      </select>
    </aside>
  );
}

