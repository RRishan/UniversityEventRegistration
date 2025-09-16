import React, { createContext, useState } from "react";

// Create context
export const UserContext = createContext();

// Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: "Malin",
    role: "Frontend Developer",
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
