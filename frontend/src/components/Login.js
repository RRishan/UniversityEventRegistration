import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../Context/UserContext";
import "./Login.css";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { loginUser } = useContext(UserContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const response = await axios.post("http://localhost:3001/api/auth/login", {
        email,
        password,
      });

      // Assuming the backend returns the user data or token
      loginUser(response.data);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      setError("Your email or password are incorrect.\nPlease try again !");
    }
  };

  return (
    <div className="login-container">
      {/* Logo Overlay */}
      <div className="login-logo-container">
        <div className="login-logo">
          <span>Eventraze</span>
        </div>
      </div>

      {/* Left Panel - Image with Logo */}
      <div className="login-image-section">
        <div className="login-overlay-gradient"></div>
      </div>

      {/* Right Section - Form */}
      <div className="login-form-section">
        <div className="login-card"> {/* Card Wrapper */}
          <div className="login-header">
            <h2>Log in</h2>
          </div>



          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <label>Username</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="extra-options">
              <label>
                <input type="checkbox" /> Remember Me
              </label>
              <Link to="/forgot">Forgot Password?</Link>
            </div>


            {error && <div className="error-message">{error}</div>}

            <button className="login-btn">Log in</button>
          </form>

          <Link to="/register" className="signup-btn">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
