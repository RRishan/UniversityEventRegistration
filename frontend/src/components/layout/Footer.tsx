import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-6">
      <div className="container mx-auto px-6 flex items-center justify-between">
        <p className="text-sm opacity-80">
          © {new Date().getFullYear()} University Event Management Platform
        </p>
        <div className="flex items-center gap-6">
          <Link to="/privacy" className="text-sm opacity-80 hover:opacity-100 underline">
            Privacy policy
          </Link>
          <Link to="/terms" className="text-sm opacity-80 hover:opacity-100 underline">
            Terms of service
          </Link>
          <Link to="/cookies" className="text-sm opacity-80 hover:opacity-100 underline">
            Cookies settings
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
