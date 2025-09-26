// frontend/src/services/auth.js
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "/api", // adjust if your backend URL differs
  headers: { "Content-Type": "application/json" },
});

export function register(payload) {
  // POST /auth/register or /register depending on backend; adjust path if needed.
  // The spreadsheet indicates backend registration expects confirmPassword to exist.
  return api.post("/auth/register", payload);
}

// export other auth helpers if needed
export default { register };
