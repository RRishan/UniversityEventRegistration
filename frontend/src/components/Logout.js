import api from "../api";

function Logout({ setUser }) {
  const handleLogout = async () => {
    try {
      await api.post("/logout"); // Call backend to log out
      setUser(null); // Clear user state
      console.log("Logged out successfully");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
}

export default Logout;
