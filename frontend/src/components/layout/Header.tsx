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

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { backendUrl, setIsLoggedIn, userData } = useContext(AppContext);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowMoreDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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

  const linkStyle = (path: string) =>
    `relative px-3 py-1.5 rounded-lg text-[0.82rem] transition whitespace-nowrap ${
      isActive(path)
        ? "text-[#f0ede8] bg-white/10 after:absolute after:bottom-[4px] after:left-1/2 after:-translate-x-1/2 after:w-4 after:h-[2px] after:bg-[#ffbe3c] after:rounded"
        : "text-[#f0ede873] hover:text-[#f0ede8] hover:bg-white/5"
    }`;

  return (
    <header className="sticky top-0 z-[100] w-full bg-[#0a0a0bd1] backdrop-blur-xl backdrop-saturate-150 border-b border-white/10 font-sans">
      <div className="max-w-[1200px] mx-auto px-6 h-[62px] flex items-center justify-between gap-4">

        {/* Logo */}
        <Link
          to="/"
          className="font-serif text-[1.6rem] font-light tracking-[0.1em] text-[#f0ede8] drop-shadow-[0_0_30px_rgba(255,200,80,0.25)] hover:drop-shadow-[0_0_40px_rgba(255,200,80,0.45)]"
        >
          Eventraze
        </Link>

        {/* Nav */}
        <nav className="hidden sm:flex items-center gap-1">
          <Link to="/" className={linkStyle("/")}>
            Home
          </Link>

          <Link to="/events" className={linkStyle("/events")}>
            Events
          </Link>

          {userData?.role === "organizer" && (
            <Link to="/my-events" className={linkStyle("/my-events")}>
              My Events
            </Link>
          )}

          <Link to="/profile" className={linkStyle("/profile")}>
            My Profile
          </Link>

          {isAdminOrLecturer && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowMoreDropdown((p) => !p)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[0.82rem] transition ${
                  showMoreDropdown
                    ? "bg-white/5 text-[#f0ede8]"
                    : "text-[#f0ede873] hover:text-[#f0ede8] hover:bg-white/5"
                }`}
              >
                More
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    showMoreDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showMoreDropdown && (
                <div className="absolute right-0 top-full mt-2 min-w-[200px] bg-[#111113] border border-white/10 rounded-xl p-2 shadow-[0_20px_60px_rgba(0,0,0,0.55)] animate-[fadeIn_.18s_ease]">

                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-2 rounded-lg text-[0.82rem] text-[#f0ede880] hover:bg-white/5 hover:text-[#f0ede8]"
                  >
                    <User size={15} /> My Profile
                  </Link>

                  <div className="h-px bg-white/10 my-1" />

                  <Link
                    to="/approval-dashboard"
                    className="flex items-center gap-3 px-4 py-2 rounded-lg text-[0.82rem] text-[#f0ede880] hover:bg-white/5 hover:text-[#f0ede8]"
                  >
                    <ShieldCheck size={15} /> Approval Dashboard
                  </Link>

                  <Link
                    to="/admin"
                    className="flex items-center gap-3 px-4 py-2 rounded-lg text-[0.82rem] text-[#f0ede880] hover:bg-white/5 hover:text-[#f0ede8]"
                  >
                    <LayoutDashboard size={15} /> Admin Panel
                  </Link>

                  <Link
                    to="/reports"
                    className="flex items-center gap-3 px-4 py-2 rounded-lg text-[0.82rem] text-[#f0ede880] hover:bg-white/5 hover:text-[#f0ede8]"
                  >
                    <BarChart3 size={15} /> Reports
                  </Link>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3 shrink-0">

          {userData?.name && (
            <span className="hidden md:block text-[0.78rem] text-[#f0ede873] max-w-[100px] truncate">
              {userData.name}
            </span>
          )}

          <Link to="/profile">
            <div className="w-[34px] h-[34px] rounded-full border border-white/10 bg-[#ffbe3c1a] flex items-center justify-center hover:border-[#ffbe3c73] hover:shadow-[0_0_0_3px_rgba(255,190,60,0.08)] transition">
              <User size={15} className="text-[#ffbe3cb3]" />
            </div>
          </Link>

          <div className="w-px h-[22px] bg-white/10" />

          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[0.78rem] text-[#f0ede85c] hover:text-[#ff6b6b] hover:border hover:border-[#ff6b6b33] hover:bg-[#ff6b6b14] transition"
          >
            <LogOut size={13} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;