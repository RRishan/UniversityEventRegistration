// src/context/UserContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({ id: 1, name: "Test User" }); // temp until integrated
  const [events, setEvents] = useState([]);

  // Simulate fetching events
  useEffect(() => {
    const fakeEvents = [
      { id: 1, title: "Orientation", date: "2025-09-20" },
      { id: 2, title: "Workshop", date: "2025-09-22" },
      { id: 3, title: "Hackathon", date: "2025-09-25" },
    ];
    setEvents(fakeEvents);
  }, []);

  return (
    <UserContext.Provider value={{ user, events, setEvents }}>
      {children}
    </UserContext.Provider>
  );
};

