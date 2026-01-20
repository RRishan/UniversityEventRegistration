import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import concertStage from "@/assets/concert-stage.png";
import { AppContext } from "@/context/AppContext";
import axios from "axios";
import { toast } from "sonner";

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("jk@gmail.com");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const {backendUrl, setIsLoggedIn, checkAuth, userData} = useContext(AppContext);

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if (email && password) {
        setError("");
        
        axios.defaults.withCredentials = true;

        const {data} = await axios.post(backendUrl + "/api/auth/login", { email, password });

        if (data.success) {
          
          console.log(userData?.role == 'lecture')
          if (userData?.role == 'lecture') {
            navigate("/approval-dashboard");
          }else {
            navigate("/");
          }
          setIsLoggedIn(true);
          toast.success("Login successful!");
        }else {
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
    <div className="auth-container">
      <div className="auth-card-wrapper">
        {/* Left side - Image */}
        <div className="auth-image-section">
          <img 
            src={concertStage} 
            alt="Concert Stage" 
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
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
              />
            </div>
            
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-border w-4 h-4"
                />
                Remember Me
              </label>
              <Link to="/forgot-password" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Forgot Password?
              </Link>
            </div>

            {error && (
              <p className="text-destructive text-sm bg-destructive/10 px-3 py-2 rounded-lg">{error}</p>
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