import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import concertStage from "@/assets/concert-stage.png";
import { AppContext } from "@/context/AppContext";
import axios from "axios";
import { toast } from "sonner";

/* ---------------- Icons ---------------- */

const IconMail = () => (
  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40">
    <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="1.6" fill="none"/>
    <path d="M2 7l10 7 10-7" stroke="currentColor" strokeWidth="1.6"/>
  </svg>
);

const IconLock = () => (
  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40">
    <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" fill="none"/>
    <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="1.6"/>
  </svg>
);

/* ---------------- Component ---------------- */

const SignIn = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState("jk@gmail.com");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const { backendUrl, setIsLoggedIn, checkAuth } =
    useContext(AppContext);

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      if (!email || !password) {
        setError("Your email or password are incorrect.");
        return;
      }

      axios.defaults.withCredentials = true;

      const { data } = await axios.post(
        backendUrl + "/api/auth/login",
        { email, password }
      );

      if (data.success) {
        await checkAuth();

        if (
          data.role === "lecture" ||
          data.role === "headOfSection"
        ) {
          navigate("/approval-dashboard");
        } else {
          navigate("/");
        }

        setIsLoggedIn(true);
        toast.success("Login successful!");
      } else {
        toast.error(data.message);
      }

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0a0a0b] text-[#f0ede8] font-sans">

      {/* LEFT IMAGE PANEL */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">

        <img
          src={concertStage}
          className="w-full h-full object-cover brightness-50 scale-105 hover:scale-100 transition-transform duration-[12000ms]"
        />

        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/20 to-black/80" />

        <h1 className="absolute top-10 left-10 text-3xl font-light tracking-widest font-serif">
          Eventraze
        </h1>

        <div className="absolute bottom-10 left-10 right-10">
          <h2 className="font-serif text-4xl font-light leading-tight">
            Where every moment becomes a memory
          </h2>
          <p className="uppercase text-xs tracking-widest text-white/50 mt-2">
            Discover · Book · Experience
          </p>
        </div>
      </div>

      {/* RIGHT FORM PANEL */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 max-w-xl mx-auto px-8 py-12 relative">

        {/* Mobile Logo */}
        <span className="lg:hidden font-serif text-2xl tracking-widest mb-10">
          Eventraze
        </span>

        <h1 className="font-serif text-5xl font-light mb-2">
          Welcome back
        </h1>

        <p className="uppercase text-xs tracking-widest text-white/40 mb-10">
          Sign in to your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* EMAIL */}
          <div>
            <label className="text-xs uppercase tracking-widest text-white/50">
              Email address
            </label>

            <div className="relative mt-2">
              <IconMail />

              <input
                type="email"
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-11 pr-4 py-3 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none"
                placeholder="you@example.com"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-xs uppercase tracking-widest text-white/50">
              Password
            </label>

            <div className="relative mt-2">
              <IconLock />

              <input
                type="password"
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-11 pr-4 py-3 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none"
                placeholder="••••••••"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* REMEMBER */}
          <div className="flex justify-between items-center text-sm text-white/50">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e)=>setRememberMe(e.target.checked)}
                className="accent-amber-400"
              />
              Remember me
            </label>

            <Link to="/forgot-password" className="hover:text-amber-400">
              Forgot password?
            </Link>
          </div>

          {/* ERROR */}
          {error && (
            <div className="bg-red-500/10 border border-red-400/20 text-red-400 rounded-lg px-4 py-2 text-sm">
              {error}
            </div>
          )}

          {/* SIGN IN */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg uppercase tracking-widest text-sm font-medium
            bg-gradient-to-r from-amber-400 to-orange-500 text-black
            shadow-lg shadow-amber-400/30
            hover:opacity-90 hover:-translate-y-[1px] transition"
          >
            Sign in
          </button>

          {/* DIVIDER */}
          <div className="relative text-center py-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"/>
            </div>
            <span className="relative bg-[#0a0a0b] px-4 text-xs text-white/30 uppercase tracking-widest">
              or
            </span>
          </div>

          {/* SIGN UP */}
          <Link to="/sign-up">
            <button
              type="button"
              className="w-full py-3 rounded-lg border border-white/15 text-white/70 uppercase tracking-widest text-sm hover:bg-white/5 hover:text-white transition"
            >
              Create an account
            </button>
          </Link>

        </form>
      </div>
    </div>
  );
};

export default SignIn;