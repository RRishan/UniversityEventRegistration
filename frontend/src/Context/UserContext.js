// src/Context/UserContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState({ name: "Student" });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fake fetch simulation
    setTimeout(() => {
      try {
        setEvents([
          {
            title: "Music Night",
            date: "2025-10-10",
            startTime: "18:00",
            endTime: "21:00",
            venue: "University Hall",
            category: "Music",
            description: "An evening filled with live performances.",
            poster: "/images/music-night.jpg",
          },
          {
            title: "Tech Talk",
            date: "2025-10-15",
            startTime: "14:00",
            endTime: "16:00",
            venue: "Auditorium",
            category: "Educational",
            description: "Insights into AI & software.",
            poster: "/images/tech-talk.jpg",
          },
        ]);
        setLoading(false);
      } catch (err) {
        setError("Failed to load events.");
        setLoading(false);
      }
    }, 1500);
  }, []);

  return (
    <UserContext.Provider value={{ user, events, loading, error }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUserContext = () => useContext(UserContext);


