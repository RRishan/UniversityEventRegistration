import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import concertBg from "@/assets/concert-bg.png";

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("jk@gmail.com");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login - navigate to create profile for demo
    if (email && password) {
      navigate("/create-profile");
    } else {
      setError("Your email or password are incorrect. Please try again!");
    }
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
          <h1 className="text-4xl font-bold text-foreground mb-8">Sign in</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="jk@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
              />
            </div>
            
            <div>
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-border"
                />
                Remember Me
              </label>
              <Link to="/forgot-password" className="text-sm text-muted-foreground hover:text-foreground">
                Forgot Password?
              </Link>
            </div>

            {error && (
              <p className="text-destructive text-sm">{error}</p>
            )}

            <button type="submit" className="btn-primary">
              sign in
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-muted-foreground">or</span>
              </div>
            </div>

            <Link to="/sign-up">
              <button type="button" className="btn-secondary">
                sign up
              </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
