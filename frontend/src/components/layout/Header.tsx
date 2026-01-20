import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, LogOut } from "lucide-react";
import { useContext, useState } from "react";
import { toast } from "sonner";
import { AppContext } from "@/context/AppContext";
import axios from "axios";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);

  const {backendUrl, setIsLoggedIn} = useContext(AppContext);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async  (e: React.FormEvent) => {
    try {
      e.preventDefault();

      const {data} = await axios.post(backendUrl + "/api/auth/logout");

      if (data.success) {
        toast.success("Logout successful!");
        setIsLoggedIn(false);
        navigate("/sign-in");
      }else {
        toast.error(data.message);
      }
      

    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
    
  };

  return (
    <header className="main-header">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-foreground">
          Eventraze
        </Link>

        <nav className="flex items-center gap-2">
          <Link 
            to="/" 
            className={isActive("/home") ? "nav-link-active" : "nav-link"}
          >
            Home
          </Link>
          <Link 
            to="/events" 
            className={isActive("/events") ? "nav-link-active" : "nav-link"}
          >
            Events
          </Link>
          <Link 
            to="/my-events" 
            className={isActive("/my-events") || isActive("/event-registration") ? "nav-link-active" : "nav-link"}
          >
            My Events
          </Link>
          <div className="relative">
            <button 
              onClick={() => setShowMoreDropdown(!showMoreDropdown)}
              className="nav-link flex items-center gap-1"
            >
              More <ChevronDown className="w-4 h-4" />
            </button>
            {showMoreDropdown && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-border py-2 z-50">
                <Link 
                  to="/profile" 
                  className="block px-4 py-2 hover:bg-muted transition-colors"
                  onClick={() => setShowMoreDropdown(false)}
                >
                  My Profile
                </Link>
                <Link 
                  to="/approval-dashboard" 
                  className="block px-4 py-2 hover:bg-muted transition-colors"
                  onClick={() => setShowMoreDropdown(false)}
                >
                  Approval Dashboard
                </Link>
                <Link 
                  to="/admin" 
                  className="block px-4 py-2 hover:bg-muted transition-colors"
                  onClick={() => setShowMoreDropdown(false)}
                >
                  Admin Panel
                </Link>
                <Link 
                  to="/reports" 
                  className="block px-4 py-2 hover:bg-muted transition-colors"
                  onClick={() => setShowMoreDropdown(false)}
                >
                  Reports
                </Link>
              </div>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <span className="text-lg">👤</span>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
