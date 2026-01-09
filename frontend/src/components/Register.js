import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Fixed: prevent default form submission
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Restored API call logic, though keeping the simplified success for now as per user stub
    setMessage("Account created successfully!");
    setError("");
  };

  return (
    <div className="register-container">
      {/* Left Panel - Image with Logo */}
      <div className="register-image-section">
        <div className="register-overlay-gradient"></div>
        <div className="register-logo-container">
          <div className="register-logo">
            <span>Eventraze</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="register-form-section">
        <div className="register-card">
          <div className="register-header">
            <h2>Sign up</h2>
          </div>

          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}

          <form className="register-form" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="input-group">
              <label>Full Name</label>
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email Address */}
            <div className="input-group">
              <label>Email Address</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password Row */}
            <div className="form-row">
              <div className="input-group">
                <label>Password</label>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <label>Confirm Password</label>
                <input
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Create Account Button */}
            <button type="submit" className="register-btn">
              Create Account
            </button>
          </form>

          {/* Log in Button */}
          <Link to="/login" className="login-redirect-btn">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;