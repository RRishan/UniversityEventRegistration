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
    <div className="login-page">
      {/* Left Section */}
      <div className="login-left">
        <div className="nav">
          <div className="logo">Eventraze</div>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/login">Log In</Link>
          </div>
        </div>

        <div className="hero-text">Welcome Back!</div>

      </div>

      {/* Right Section */}
      <div className="login-right">
        <div className="login-box">
          <h2>Log in</h2>

          <form onSubmit={handleLogin}>
            <div className="input-field">
              <span>👤</span>
              <input
                type="email"
                placeholder="Username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-field">
              <span>🔒</span>
              <input
                type="password"
                placeholder="Password"
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

            <div className="divider">
              <span>Or</span>
            </div>

            <Link to="/register" className="signup-btn">
              Sign up
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
