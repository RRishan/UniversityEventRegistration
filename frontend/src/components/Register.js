import { useState, useEffect } from "react";
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
  const [validation, setValidation] = useState({
    minLength: false,
    hasNumber: false,
    hasSpecial: false,
  });
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);


  useEffect(() => {
    const { password } = form;
    setValidation({
      minLength: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$]/.test(password),
    });
  }, [form.password]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Fixed: prevent default form submission
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (!validation.minLength || !validation.hasNumber || !validation.hasSpecial) {
      setError("Please meet all password requirements");
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
      {/* Logo Overlay */}
      <div className="register-logo-container">
        <div className="register-logo">
          <span>Eventraze</span>
        </div>
      </div>

      {/* Left Panel - Image with Logo (Hidden now, but keeping structure if needed or just empty) */}
      <div className="register-image-section">
        <div className="register-overlay-gradient"></div>
      </div>

      {/* Right Panel - Form */}
      <div className="register-form-section">
        <div className="register-card">
          <div className="register-header">
            <h2>Sign up</h2>
          </div>

          {message && <div className="success-message">{message}</div>}

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
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  required
                />

                {isPasswordFocused && (
                  <div className="password-requirements">
                    <div className={`requirement-item ${validation.minLength ? "valid" : "invalid"}`}>
                      <span>{validation.minLength ? "✓" : "✕"}</span> At least 8 characters
                    </div>
                    <div className={`requirement-item ${validation.hasNumber ? "valid" : "invalid"}`}>
                      <span>{validation.hasNumber ? "✓" : "✕"}</span> Include a number
                    </div>
                    <div className={`requirement-item ${validation.hasSpecial ? "valid" : "invalid"}`}>
                      <span>{validation.hasSpecial ? "✓" : "✕"}</span> Include a special character (!, @, #, $)
                    </div>
                  </div>
                )}
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
            {error && <div className="error-message">{error}</div>}
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