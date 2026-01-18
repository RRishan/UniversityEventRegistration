import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import concertStage from "@/assets/concert-stage.png";
import { Check, X } from "lucide-react";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");

  const passwordChecks = {
    minLength: formData.password.length >= 8,
    hasUppercase: /[A-Z]/.test(formData.password),
    hasNumber: /[0-9]/.test(formData.password),
    passwordsMatch: formData.password === formData.confirmPassword && formData.confirmPassword !== ""
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (!passwordChecks.passwordsMatch) {
      setError("Passwords do not match");
      return;
    }
    navigate("/create-profile");
  };

  const PasswordCheck = ({ passed, label }: { passed: boolean; label: string }) => (
    <div className="flex items-center gap-2 text-xs">
      {passed ? <Check className="w-3 h-3 text-green-500" /> : <X className="w-3 h-3 text-red-400" />}
      <span className={passed ? "text-green-600" : "text-muted-foreground"}>{label}</span>
    </div>
  );

  return (
    <div className="auth-container">
      <div className="auth-card-wrapper">
        <div className="auth-image-section">
          <img src={concertStage} alt="Concert Stage" className="w-full h-full object-cover" />
          <div className="absolute top-6 left-6">
            <div className="neon-logo animate-glow">Eventraze</div>
          </div>
        </div>

        <div className="auth-form-section">
          <h1 className="text-3xl font-bold text-foreground mb-6">Sign up</h1>
          
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="form-label text-sm">Full Name</label>
              <input type="text" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className="input-field" placeholder="Enter full name" />
            </div>
            <div>
              <label className="form-label text-sm">Email Address</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input-field" placeholder="Enter email" />
            </div>
            <div>
              <label className="form-label text-sm">Password</label>
              <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="input-field" placeholder="Create password" />
              {formData.password && (
                <div className="mt-2 space-y-1">
                  <PasswordCheck passed={passwordChecks.minLength} label="At least 8 characters" />
                  <PasswordCheck passed={passwordChecks.hasUppercase} label="One uppercase letter" />
                  <PasswordCheck passed={passwordChecks.hasNumber} label="One number" />
                </div>
              )}
            </div>
            <div>
              <label className="form-label text-sm">Confirm Password</label>
              <input type="password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} className="input-field" placeholder="Confirm password" />
              {formData.confirmPassword && <PasswordCheck passed={passwordChecks.passwordsMatch} label="Passwords match" />}
            </div>
            {error && <p className="text-destructive text-sm bg-destructive/10 px-3 py-2 rounded-lg">{error}</p>}
            <button type="submit" className="btn-primary mt-4">Create Account</button>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Already have an account? <Link to="/sign-in" className="text-primary font-medium hover:underline">Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;