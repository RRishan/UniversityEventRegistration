import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api", // backend URL
  withCredentials: true, // so cookies (JWT) are included
});

export default api;
