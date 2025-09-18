import { useState } from "react";
import api from "../api";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    regiNumber: "",
    contactNum: "",
    faculty: "",
    department: "",
    password: "",
  });

  
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/register", form);
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Full Name" onChange={handleChange} required />
        <input name="email" placeholder="Email" type="email" onChange={handleChange} required />
        <input name="regiNumber" placeholder="Registration No" onChange={handleChange} required />
        <input name="contactNum" placeholder="Contact Number" onChange={handleChange} required />
        <input name="faculty" placeholder="Faculty" onChange={handleChange} required />
        <input name="department" placeholder="Department" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Register</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default Register;
