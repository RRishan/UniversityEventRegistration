import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import concertStage from "@/assets/concert-stage.png";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { AppContext } from "@/context/AppContext";

/* ── Icons ───────────────────────── */
const IconUser = () => (
  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30">
    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.6" fill="none"/>
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.6" fill="none"/>
  </svg>
);

const IconMail = () => (
  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30">
    <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="1.6" fill="none"/>
    <path d="M2 7l10 7 10-7" stroke="currentColor" strokeWidth="1.6" fill="none"/>
  </svg>
);

const IconLock = () => (
  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30">
    <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" fill="none"/>
    <path d="M8 11V7a4 4 0 018 0v4" stroke="currentColor" strokeWidth="1.6" fill="none"/>
  </svg>
);

const IconAlert = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

/* ── Password Row ───────────────────────── */
const PasswordCheck = ({ passed, label }: { passed: boolean; label: string }) => (
  <div className="flex items-center gap-2 text-xs">
    <span
      className={`w-3.5 h-3.5 rounded-full flex items-center justify-center
      ${passed ? "bg-green-400/20 text-green-400" : "bg-red-400/10 text-white/30"}`}
    >
      {passed ? <Check size={9} strokeWidth={3}/> : <X size={9} strokeWidth={3}/>}
    </span>
    <span className={passed ? "text-green-400" : "text-white/40"}>{label}</span>
  </div>
);

/* ── Strength helper ───────────────────────── */
function strengthScore(checks: Record<string, boolean>) {
  const score = Object.values(checks).filter(Boolean).length;
  if (score === 0) return { width: "0%", color: "transparent" };
  if (score === 1) return { width: "25%", color: "#ff6b6b" };
  if (score === 2) return { width: "55%", color: "#ffbe3c" };
  if (score === 3) return { width: "80%", color: "#4ade80" };
  return { width: "100%", color: "#4ade80" };
}

/* ═══════════════════════════════════ */
const SignUp = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedIn } = useContext(AppContext);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

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

      if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
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
        formData
      );

      if (data.success) {
        setIsLoggedIn(true);
        navigate("/create-profile");
        toast.success("Account created successfully!");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Unexpected error occurred");
    }
  };

  const { width, color } = strengthScore(passwordChecks);
  const showChecks = formData.password.length > 0;
  const confirmError =
    formData.confirmPassword.length > 0 && !passwordChecks.passwordsMatch;

  return (
    <div className="min-h-screen flex bg-[#0a0a0b] text-[#f0ede8] font-sans overflow-hidden">

      {/* LEFT VISUAL */}
      <div className="hidden lg:block relative flex-1 overflow-hidden">
        <img
          src={concertStage}
          className="w-full h-full object-cover brightness-50 scale-105 hover:scale-100 transition-transform duration-[12000ms]"
        />

        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/10 to-black/80"/>
        
        <div className="absolute top-10 left-10 text-3xl tracking-widest font-serif">
          Eventraze
        </div>

        <div className="absolute bottom-10 left-10 right-10">
          <h2 className="font-serif text-4xl font-light">
            Your next great experience starts here
          </h2>
          <p className="uppercase text-xs tracking-wider text-white/50">
            Discover · Book · Experience
          </p>
        </div>
      </div>

      {/* FORM PANEL */}
      <div className="flex-1 max-w-xl mx-auto flex flex-col justify-center px-8 py-10 relative overflow-y-auto">

        <span className="lg:hidden font-serif text-2xl tracking-widest mb-8">
          Eventraze
        </span>

        <div className="flex gap-2 mb-7">
          <div className="w-5 h-[3px] bg-[#ffbe3c] rounded"/>
          <div className="w-5 h-[3px] bg-white/20 rounded"/>
        </div>

        <h1 className="font-serif text-4xl mb-1">Create account</h1>
        <p className="uppercase text-xs tracking-widest text-white/40 mb-7">
          Step 1 of 2 — Your details
        </p>

        <form onSubmit={handleSubmit}>

          {/* Name + Email */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] uppercase tracking-widest text-white/40">
                Full name
              </label>
              <div className="relative">
                <IconUser/>
                <input
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-3 text-sm focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/10 outline-none"
                  value={formData.fullName}
                  onChange={(e)=>setFormData({...formData,fullName:e.target.value})}
                  placeholder="Jane Smith"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-widest text-white/40">
                Email address
              </label>
              <div className="relative">
                <IconMail/>
                <input
                  type="email"
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-3 text-sm focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/10 outline-none"
                  value={formData.email}
                  onChange={(e)=>setFormData({...formData,email:e.target.value})}
                  placeholder="you@example.com"
                />
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="mt-4">
            <label className="text-[11px] uppercase tracking-widest text-white/40">
              Password
            </label>

            <div className="relative">
              <IconLock/>
              <input
                type="password"
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-3 text-sm focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/10 outline-none"
                value={formData.password}
                onChange={(e)=>setFormData({...formData,password:e.target.value})}
              />
            </div>

            {showChecks && (
              <div className="mt-3 bg-white/5 border border-white/10 rounded-lg p-3 space-y-1">
                <PasswordCheck passed={passwordChecks.minLength} label="At least 8 characters"/>
                <PasswordCheck passed={passwordChecks.hasUppercase} label="One uppercase letter"/>
                <PasswordCheck passed={passwordChecks.hasNumber} label="One number"/>

                <div className="h-[2px] bg-white/10 rounded mt-2 overflow-hidden">
                  <div style={{width, background:color}} className="h-full transition-all"/>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mt-4">
            <label className="text-[11px] uppercase tracking-widest text-white/40">
              Confirm password
            </label>

            <div className="relative">
              <IconLock/>
              <input
                type="password"
                className={`w-full bg-white/5 border rounded-lg py-3 pl-10 pr-3 text-sm outline-none
                ${confirmError
                  ? "border-red-400/50 ring-2 ring-red-400/10"
                  : "border-white/10 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/10"}`}
                value={formData.confirmPassword}
                onChange={(e)=>setFormData({...formData,confirmPassword:e.target.value})}
              />
            </div>

            {formData.confirmPassword && (
              <div className="mt-2">
                <PasswordCheck
                  passed={passwordChecks.passwordsMatch}
                  label="Passwords match"
                />
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-3 mt-3">
              <IconAlert/>
              {error}
            </div>
          )}

          {/* Button */}
          <button
            type="submit"
            className="w-full mt-4 py-3 rounded-lg text-black text-xs uppercase tracking-widest
            bg-gradient-to-br from-[#ffbe3c] to-[#ff8c00]
            hover:opacity-90 hover:-translate-y-[1px]
            shadow-[0_4px_24px_rgba(255,190,60,0.25)]
            transition-all"
          >
            Create account
          </button>

          <p className="text-center text-sm text-white/40 mt-5">
            Already have an account?{" "}
            <Link to="/sign-in" className="text-[#ffbe3c] hover:opacity-80">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;