import React, { createContext, useState, useContext } from "react";

// Create Context
const UserContext = createContext();

// Provider Component
export const UserProvider = ({ children }) => {
  // Store user + events in context
  const [user, setUser] = useState(null);

  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Freshers’ Orientation",
      date: "2025-10-05",
      startTime: "10:00 AM",
      endTime: "12:00 PM",
      venue: "Main Hall",
      category: "Educational"
    },
    {
      id: 2,
      title: "Cultural Night",
      date: "2025-10-10",
      startTime: "7:00 PM",
      endTime: "10:00 PM",
      venue: "Open Theatre",
      category: "Entertainment"
    }
  ]);

  // Add new event
  const addEvent = (event) => {
    setEvents((prev) => [...prev, { id: Date.now(), ...event }]);
  };

  // Update event
  const updateEvent = (id, updatedEvent) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === id ? { ...event, ...updatedEvent } : event))
    );
  };

  // Delete event
  const deleteEvent = (id) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  };

  return (
    <UserContext.Provider value={{ user, setUser, events, addEvent, updateEvent, deleteEvent }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom Hook to use context easily
export const useUserContext = () => {
  return useContext(UserContext);
};


