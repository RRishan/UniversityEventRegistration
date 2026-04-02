import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  BarChart3,
  User,
} from "lucide-react";
import { useContext, useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { AppContext } from "@/context/AppContext";
import axios from "axios";

/* ─────────────────────────────────────────
   SPARKLE LOGO ICON
───────────────────────────────────────── */
const IconSparkle = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
  </svg>
);

/* ─────────────────────────────────────────
   ANIMATED INDICATOR DOT
───────────────────────────────────────── */
const ActiveDot = () => (
  <span className="absolute -bottom-[3px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500 shadow-[0_0_6px_2px_rgba(59,130,246,0.5)]" />
);

/* ─────────────────────────────────────────
   MAIN HEADER COMPONENT
───────────────────────────────────────── */
const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { backendUrl, setIsLoggedIn, userData } = useContext(AppContext);

  const isActive = (path: string) => location.pathname === path;

  /* scroll shadow effect */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* close dropdown on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowMoreDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* close dropdown on route change */
  useEffect(() => {
    setShowMoreDropdown(false);
  }, [location.pathname]);

  const handleLogout = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const { data } = await axios.post(backendUrl + "/api/auth/logout");
      if (data.success) {
        toast.success("Logout successful!");
        setIsLoggedIn(false);
        navigate("/sign-in");
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Logout failed. Please try again.");
    }
  };

  const isAdminOrLecturer =
    userData && (userData.role === "admin" || userData.role === "lecturer");

  /* nav link base */
  const navLink = (path: string) =>
    `relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[0.82rem] font-medium transition-all duration-200 whitespace-nowrap ${
      isActive(path)
        ? "text-blue-600 bg-blue-50"
        : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
    }`;

  /* avatar initials */
  const initials = userData?.name
    ? userData.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <>
      <style>{`

      `}</style>

      <header
        className={`header-glass sticky top-0 z-[100] w-full border-b border-slate-200/60 font-body transition-all duration-300 ${
          scrolled ? "scrolled" : ""
        }`}
      >
        <div className="max-w-[1240px] mx-auto px-5 h-[64px] flex items-center justify-between gap-4">

          {/* ── LOGO ── */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="logo-badge w-8 h-8 rounded-xl flex items-center justify-center text-white">
              <IconSparkle />
            </div>
            <span className="font-display text-slate-800 text-[1.2rem] font-medium tracking-wide">
              Eventraze
            </span>
          </Link>

          {/* ── NAV ── */}
          <nav className="hidden sm:flex items-center gap-1 flex-1 justify-center">

            <Link to="/" className={navLink("/")}>
              Home
              {isActive("/") && <span className="nav-link-active-bar" />}
            </Link>

            <Link to="/events" className={navLink("/events")}>
              Events
              {isActive("/events") && <span className="nav-link-active-bar" />}
            </Link>

            {userData?.role === "organizer" && (
              <Link to="/my-events" className={navLink("/my-events")}>
                My Events
                {isActive("/my-events") && <span className="nav-link-active-bar" />}
              </Link>
            )}

            <Link to="/profile" className={navLink("/profile")}>
              My Profile
              {isActive("/profile") && <span className="nav-link-active-bar" />}
            </Link>

            {/* ── MORE DROPDOWN ── */}
            {isAdminOrLecturer && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowMoreDropdown((p) => !p)}
                  className={`more-btn flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[0.82rem] font-medium border transition-all ${
                    showMoreDropdown
                      ? "open"
                      : "text-slate-500 border-transparent hover:text-slate-800 hover:bg-slate-100"
                  }`}
                >
                  More
                  <ChevronDown
                    size={13}
                    className={`transition-transform duration-200 ${showMoreDropdown ? "rotate-180" : ""}`}
                  />
                </button>

                {showMoreDropdown && (
                  <div className="dropdown-panel absolute right-0 top-[calc(100%+8px)] min-w-[210px] rounded-2xl p-2 z-50">

                    {/* Profile shortcut */}
                    <Link
                      to="/profile"
                      className="dropdown-item flex items-center gap-3 px-4 py-2.5 rounded-xl text-[0.82rem] font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
                        <User size={14} />
                      </span>
                      My Profile
                    </Link>

                    {/* Divider */}
                    <div className="mx-3 my-1.5 h-px bg-slate-100" />

                    <Link
                      to="/approval-dashboard"
                      className="dropdown-item flex items-center gap-3 px-4 py-2.5 rounded-xl text-[0.82rem] font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center">
                        <ShieldCheck size={14} />
                      </span>
                      Approval Dashboard
                    </Link>

                    <Link
                      to="/admin"
                      className="dropdown-item flex items-center gap-3 px-4 py-2.5 rounded-xl text-[0.82rem] font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <span className="w-7 h-7 rounded-lg bg-violet-50 text-violet-500 flex items-center justify-center">
                        <LayoutDashboard size={14} />
                      </span>
                      Admin Panel
                    </Link>

                    <Link
                      to="/reports"
                      className="dropdown-item flex items-center gap-3 px-4 py-2.5 rounded-xl text-[0.82rem] font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <span className="w-7 h-7 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center">
                        <BarChart3 size={14} />
                      </span>
                      Reports
                    </Link>

                    {/* Bottom gradient accent */}
                    <div className="mx-2 mt-2 h-[2px] rounded-full bg-gradient-to-r from-blue-400/30 via-indigo-400/30 to-transparent" />
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* ── RIGHT ACTIONS ── */}
          <div className="flex items-center gap-2.5 shrink-0">

            {/* Username */}
            {userData?.name && (
              <span className="hidden lg:block text-[0.78rem] font-medium text-slate-500 max-w-[110px] truncate">
                {userData.name}
              </span>
            )}

            {/* Avatar */}
            <Link to="/profile">
              <div className="avatar-ring">
                <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-blue-50 to-sky-50 flex items-center justify-center">
                  {userData?.name ? (
                    <span className="text-[11px] font-bold text-blue-600 tracking-wide">{initials}</span>
                  ) : (
                    <User size={14} className="text-blue-400" />
                  )}
                </div>
              </div>
            </Link>

            {/* Divider */}
            <div className="header-divider" />

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="logout-btn flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[0.78rem] font-medium text-slate-400"
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Bottom highlight line */}
        <div className="absolute bottom-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-blue-400/25 to-transparent pointer-events-none" />
      </header>
    </>
  );
};

export default Header;