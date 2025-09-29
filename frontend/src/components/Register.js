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
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState(""); 

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match ❌");
      return;
    }

    try {
      const res = await api.post("/auth/register", form);
      setMessage(res.data.message);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="regiNumber"
          placeholder="Registration No"
          value={form.regiNumber}
          onChange={handleChange}
          required
        />

        <input
          name="contactNum"
          placeholder="Contact Number"
          value={form.contactNum}
          onChange={handleChange}
          required
        />

        <input
          name="faculty"
          placeholder="Faculty"
          value={form.faculty}
          onChange={handleChange}
          required
        />

        <input
          name="department"
          placeholder="Department"
          value={form.department}
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        <button type="submit">Register</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
    </div>
  );
}

export default Register;
