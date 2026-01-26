import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
            {/* Logo Column */}
            <div className="md:col-span-1">
              <h3 className="text-2xl font-bold text-gray-900 italic mb-4">Logo</h3>
              <p className="text-sm text-gray-500 mb-4">
                Stay informed about campus events and opportunities.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white"
                />
                <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                By subscribing, you agree to our privacy policy and communication terms.
              </p>
            </div>

            {/* Quick links */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Quick links</h4>
              <ul className="space-y-2">
                <li><Link to="/events" className="text-sm text-gray-500 hover:text-gray-900">Events</Link></li>
                <li><Link to="/event-registration" className="text-sm text-gray-500 hover:text-gray-900">Registration</Link></li>
                <li><Link to="#" className="text-sm text-gray-500 hover:text-gray-900">Support</Link></li>
                <li><Link to="#" className="text-sm text-gray-500 hover:text-gray-900">FAQ</Link></li>
                <li><Link to="#" className="text-sm text-gray-500 hover:text-gray-900">Contact</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link to="#" className="text-sm text-gray-500 hover:text-gray-900">Assistance</Link></li>
                <li><Link to="#" className="text-sm text-gray-500 hover:text-gray-900">Services</Link></li>
                <li><Link to="#" className="text-sm text-gray-500 hover:text-gray-900">Guides</Link></li>
                <li><Link to="#" className="text-sm text-gray-500 hover:text-gray-900">Blog</Link></li>
                <li><Link to="#" className="text-sm text-gray-500 hover:text-gray-900">Community</Link></li>
              </ul>
            </div>

            {/* Follow us */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Follow us</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="#" className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-2">
                    <span>○</span> Facebook
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-2">
                    <span>○</span> Instagram
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-2">
                    <span>○</span> X
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-2">
                    <span>○</span> LinkedIn
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-2">
                    <span>○</span> YouTube
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="flex items-center justify-between pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} University Event Management Platform
            </p>
            <div className="flex items-center gap-6">
              <Link to="#" className="text-sm text-gray-500 hover:text-gray-900 underline">
                Privacy policy
              </Link>
              <Link to="#" className="text-sm text-gray-500 hover:text-gray-900 underline">
                Terms of service
              </Link>
              <Link to="#" className="text-sm text-gray-500 hover:text-gray-900 underline">
                Cookies settings
              </Link>
            </div>
          </div>
        </div>
      </footer>
  );
};

export default Footer;
