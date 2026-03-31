import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, LayoutDashboard, ShieldCheck, BarChart3, User } from "lucide-react";
import { useContext, useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { AppContext } from "@/context/AppContext";
import axios from "axios";
import { css } from "@/styles/Header";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { backendUrl, setIsLoggedIn, userData } = useContext(AppContext);

  const isActive = (path: string) => location.pathname === path;

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowMoreDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close dropdown on route change
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
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  const isAdminOrLecturer =
    userData && (userData.role === "admin" || userData.role === "lecturer");

  return (
    <header className="hd-header">
      <style>{css}</style>

      <div className="hd-inner">

        {/* ── Logo ── */}
        <Link to="/" className="hd-logo">Eventraze</Link>

        {/* ── Nav ── */}
        <nav className="hd-nav">
          <Link
            to="/"
            className={`hd-link ${isActive("/") || isActive("/home") ? "hd-link--active" : ""}`}
          >
            Home
          </Link>

          <Link
            to="/events"
            className={`hd-link ${isActive("/events") ? "hd-link--active" : ""}`}
          >
            Events
          </Link>

          {userData?.role === "organizer" && (
            <Link
              to="/my-events"
              className={`hd-link ${
                isActive("/my-events") || isActive("/event-registration") ? "hd-link--active" : ""
              }`}
            >
              My Events
            </Link>
          )}

          <Link
            to="/profile"
            className={`hd-link ${isActive("/profile") ? "hd-link--active" : ""}`}
          >
            My Profile
          </Link>

          {/* More dropdown — admin / lecturer only */}
          {isAdminOrLecturer && (
            <div className="hd-more-wrap" ref={dropdownRef}>
              <button
                onClick={() => setShowMoreDropdown((p) => !p)}
                className={`hd-more-btn ${showMoreDropdown ? "hd-more-btn--open" : ""}`}
                aria-haspopup="true"
                aria-expanded={showMoreDropdown}
              >
                More
                <ChevronDown
                  className={`hd-chevron ${showMoreDropdown ? "hd-chevron--open" : ""}`}
                  size={14}
                />
              </button>

              {showMoreDropdown && (
                <div className="hd-dropdown" role="menu">
                  <Link
                    to="/profile"
                    className="hd-dropdown-item"
                    onClick={() => setShowMoreDropdown(false)}
                  >
                    <User size={15} /> My Profile
                  </Link>

                  <div className="hd-dropdown-sep" />

                  <Link
                    to="/approval-dashboard"
                    className="hd-dropdown-item"
                    onClick={() => setShowMoreDropdown(false)}
                  >
                    <ShieldCheck size={15} /> Approval Dashboard
                  </Link>

                  <Link
                    to="/admin"
                    className="hd-dropdown-item"
                    onClick={() => setShowMoreDropdown(false)}
                  >
                    <LayoutDashboard size={15} /> Admin Panel
                  </Link>

                  <Link
                    to="/reports"
                    className="hd-dropdown-item"
                    onClick={() => setShowMoreDropdown(false)}
                  >
                    <BarChart3 size={15} /> Reports
                  </Link>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* ── Right: Avatar + Logout ── */}
        <div className="hd-actions">
          {/* User display name */}
          {userData?.name && (
            <span className="hd-user-name">{userData.name}</span>
          )}

          {/* Avatar */}
          <Link to="/profile" className="hd-avatar-link" aria-label="My profile">
            <div className="hd-avatar">
              <User size={15} />
            </div>
          </Link>

          <div className="hd-divider" />

          {/* Logout */}
          <button onClick={handleLogout} className="hd-logout" aria-label="Logout">
            <LogOut />
            <span>Logout</span>
          </button>
        </div>

      </div>
    </header>
  );
};

export default Header;