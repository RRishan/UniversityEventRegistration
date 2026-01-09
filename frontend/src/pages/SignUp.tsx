import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import concertBg from "@/assets/concert-bg.png";

const SignUp = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to create profile after signup
    navigate("/create-profile");
  };

  return (
    <div className="auth-container">
      <div className="auth-card-wrapper">
        {/* Left side - Image */}
        <div className="auth-image-section">
          <img 
            src={concertBg} 
            alt="Concert" 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-6 left-6">
            <div className="neon-logo animate-glow">
              Eventraze
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="auth-form-section">
          <h1 className="text-4xl font-bold text-foreground mb-8">Sign up</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input-field"
              />
            </div>
            
            <div>
              <label className="form-label">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            <button type="submit" className="btn-primary mt-6">
              Create Account
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
            </div>

            <Link to="/sign-in">
              <button type="button" className="btn-secondary">
                Log in
              </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
