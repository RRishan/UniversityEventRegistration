import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../Context/UserContext";
import "./Login.css";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { loginUser } = useContext(UserContext);

  const handleLogin = (e) => {
    e.preventDefault();
    const mockUser = { email };
    loginUser(mockUser);
    navigate("/dashboard");
  };

  return (
    <div className="login-container">
      {/* Left Panel - Image with Logo */}
      <div className="login-image-section">
        <div className="login-overlay-gradient"></div>
        <div className="login-logo-container">
          <div className="login-logo">
            <span>Eventraze</span>
          </div>
        </div>
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
