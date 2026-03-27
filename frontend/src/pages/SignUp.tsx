import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import concertStage from "@/assets/concert-stage.png";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { AppContext } from "@/context/AppContext";
import { css } from "@/styles/SignUpPage";

/* ── Inline SVG icons ─────────────────────────────────────── */
const IconUser = () => (
  <svg
    className="er-input-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);
const IconMail = () => (
  <svg
    className="er-input-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="4" width="20" height="16" rx="3" />
    <path d="M2 7l10 7 10-7" />
  </svg>
);
const IconLock = () => (
  <svg
    className="er-input-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);
const IconAlert = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ flexShrink: 0 }}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

/* ── Password check row ─────────────────────────────────────── */
const PasswordCheck = ({
  passed,
  label,
}: {
  passed: boolean;
  label: string;
}) => (
  <div className="er-check-row">
    <span
      className={`er-check-icon ${passed ? "er-check-icon--pass" : "er-check-icon--fail"}`}
    >
      {passed ? (
        <Check size={9} strokeWidth={3} />
      ) : (
        <X size={9} strokeWidth={3} />
      )}
    </span>
    <span className={passed ? "er-check-label--pass" : "er-check-label--fail"}>
      {label}
    </span>
  </div>
);

/* ── Strength bar helper ─────────────────────────────────── */
function strengthScore(checks: Record<string, boolean>) {
  const score = Object.values(checks).filter(Boolean).length;
  if (score === 0) return { width: "0%", color: "transparent" };
  if (score === 1) return { width: "25%", color: "#ff6b6b" };
  if (score === 2) return { width: "55%", color: "#ffbe3c" };
  if (score === 3) return { width: "80%", color: "#4ade80" };
  return { width: "100%", color: "#4ade80" };
}

/* ══════════════════════════════════════════════════════════ */
const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const { backendUrl, setIsLoggedIn } = useContext(AppContext);

  const passwordChecks = {
    minLength: formData.password.length >= 8,
    hasUppercase: /[A-Z]/.test(formData.password),
    hasNumber: /[0-9]/.test(formData.password),
    passwordsMatch:
      formData.password === formData.confirmPassword &&
      formData.confirmPassword !== "",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if (
        !formData.fullName ||
        !formData.email ||
        !formData.password ||
        !formData.confirmPassword
      ) {
        setError("Please fill in all fields");
        return;
      }
      if (!passwordChecks.passwordsMatch) {
        setError("Passwords do not match");
        return;
      }
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        backendUrl + "/api/auth/register",
        formData,
      );
      if (data.success) {
        setIsLoggedIn(true);
        navigate("/create-profile");
        toast.success("Account created successfully!");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again." + error);
    }
  };

  const { width: barWidth, color: barColor } = strengthScore(passwordChecks);
  const showChecks = formData.password.length > 0;
  const confirmHasError =
    formData.confirmPassword.length > 0 && !passwordChecks.passwordsMatch;

  return (
    <>
      <style>{css}</style>

      <div className="er-root">
        {/* ── Left: Visual panel ── */}
        <div className="er-visual">
          <img src={concertStage} alt="Concert Stage" />
          <div className="er-logo">Eventraze</div>
          <div className="er-tagline">
            <h2>Your next great experience starts here</h2>
            <p>Discover · Book · Experience</p>
          </div>
        </div>

        {/* ── Right: Form panel ── */}
        <div className="er-form-panel">
          {/* Mobile-only logo */}
          <span className="er-mobile-logo">Eventraze</span>

          {/* Step indicator (purely decorative, matches "step 1 of 2" in flow) */}
          <div className="er-progress">
            <div className="er-dot er-dot--active" />
            <div className="er-dot" />
          </div>

          <h1 className="er-heading">Create account</h1>
          <p className="er-subheading">Step 1 of 2 — Your details</p>

          <form onSubmit={handleSubmit}>
            {/* ── Name + Email row ── */}
            <div className="er-grid-2">
              <div className="er-field">
                <label className="er-label" htmlFor="fullName">
                  Full name
                </label>
                <div className="er-input-wrap">
                  <IconUser />
                  <input
                    id="fullName"
                    type="text"
                    placeholder="Jane Smith"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="er-input"
                    autoComplete="name"
                  />
                </div>
              </div>

              <div className="er-field">
                <label className="er-label" htmlFor="email">
                  Email address
                </label>
                <div className="er-input-wrap">
                  <IconMail />
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="er-input"
                    autoComplete="email"
                  />
                </div>
              </div>
            </div>

            {/* ── Password ── */}
            <div className="er-field">
              <label className="er-label" htmlFor="password">
                Password
              </label>
              <div className="er-input-wrap">
                <IconLock />
                <input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="er-input"
                  autoComplete="new-password"
                />
              </div>

              {showChecks && (
                <div className="er-checks">
                  <PasswordCheck
                    passed={passwordChecks.minLength}
                    label="At least 8 characters"
                  />
                  <PasswordCheck
                    passed={passwordChecks.hasUppercase}
                    label="One uppercase letter"
                  />
                  <PasswordCheck
                    passed={passwordChecks.hasNumber}
                    label="One number"
                  />
                  {/* Strength bar */}
                  <div className="er-strength-bar">
                    <div
                      className="er-strength-fill"
                      style={{ width: barWidth, background: barColor }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* ── Confirm password ── */}
            <div className="er-field">
              <label className="er-label" htmlFor="confirmPassword">
                Confirm password
              </label>
              <div className="er-input-wrap">
                <IconLock />
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className={`er-input ${confirmHasError ? "er-input--error" : ""}`}
                  autoComplete="new-password"
                />
              </div>
              {formData.confirmPassword && (
                <div style={{ marginTop: "0.45rem" }}>
                  <PasswordCheck
                    passed={passwordChecks.passwordsMatch}
                    label="Passwords match"
                  />
                </div>
              )}
            </div>

            {/* ── Error ── */}
            {error && (
              <div className="er-error">
                <IconAlert />
                {error}
              </div>
            )}

            {/* ── Submit ── */}
            <button type="submit" className="er-btn-primary">
              Create account
            </button>

            {/* ── Footer ── */}
            <p className="er-footer-text">
              Already have an account?{" "}
              <Link to="/sign-in" className="er-footer-link">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
