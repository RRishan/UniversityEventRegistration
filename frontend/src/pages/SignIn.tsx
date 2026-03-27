import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import concertStage from "@/assets/concert-stage.png";
import { AppContext } from "@/context/AppContext";
import axios from "axios";
import { toast } from "sonner";
import { css } from "@/styles/signPage";

// ── SVG Icons (inline, no extra dep) ──────────────────────────
const IconMail = () => (
  <svg className="er-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="3"/>
    <path d="M2 7l10 7 10-7"/>
  </svg>
);
const IconLock = () => (
  <svg className="er-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="11" width="14" height="10" rx="2"/>
    <path d="M8 11V7a4 4 0 0 1 8 0v4"/>
  </svg>
);
const IconAlert = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

// ─────────────────────────────────────────────────────────────
const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("jk@gmail.com");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const { backendUrl, setIsLoggedIn, checkAuth, userData } = useContext(AppContext);

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if (email && password) {
        setError("");
        axios.defaults.withCredentials = true;
        const { data } = await axios.post(backendUrl + "/api/auth/login", { email, password });
        if (data.success) {
          await checkAuth();
          if (data.role && (data.role === "lecture" || data.role === "headOfSection")) {
            navigate("/approval-dashboard");
          } else {
            navigate("/");
          }
          setIsLoggedIn(true);
          toast.success("Login successful!");
        } else {
          toast.error(data.message);
        }
      } else {
        setError("Your email or password are incorrect. Please try again!");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <>
      <style>{css}</style>

      <div className="er-root">
        {/* ── Left: Visual panel ── */}
        <div className="er-visual">
          <img src={concertStage} alt="Concert Stage" />

          <div className="er-logo">Eventraze</div>

          <div className="er-tagline">
            <h2>Where every moment becomes a memory</h2>
            <p>Discover · Book · Experience</p>
          </div>
        </div>

        {/* ── Right: Form panel ── */}
        <div className="er-form-panel">
          {/* Mobile-only logo */}
          <span className="er-mobile-logo">Eventraze</span>

          <h1 className="er-heading">Welcome back</h1>
          <p className="er-subheading">Sign in to your account</p>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="er-field">
              <label className="er-label" htmlFor="email">Email address</label>
              <div className="er-input-wrap">
                <IconMail />
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="er-input"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="er-field">
              <label className="er-label" htmlFor="password">Password</label>
              <div className="er-input-wrap">
                <IconLock />
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="er-input"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* Remember me + Forgot */}
            <div className="er-row">
              <label className="er-remember">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>
              <Link to="/forgot-password" className="er-forgot">Forgot password?</Link>
            </div>

            {/* Error */}
            {error && (
              <div className="er-error">
                <IconAlert />
                {error}
              </div>
            )}

            {/* Primary CTA */}
            <button type="submit" className="er-btn-primary">
              Sign in
            </button>

            {/* Divider */}
            <div className="er-divider"><span>or</span></div>

            {/* Sign up */}
            <Link to="/sign-up" style={{ textDecoration: "none" }}>
              <button type="button" className="er-btn-secondary">
                Create an account
              </button>
            </Link>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignIn;