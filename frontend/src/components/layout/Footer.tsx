import { Link } from "react-router-dom";
import { css } from "../../styles/Footer";

/* ── Tiny inline SVGs for social icons (no extra deps) ─── */
const IconFacebook = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const IconInstagram = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2"/>
    <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2"/>
    <circle cx="17.5" cy="6.5" r="1.5"/>
  </svg>
);
const IconX = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const IconLinkedIn = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);
const IconYouTube = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#0a0a0b"/>
  </svg>
);

/* ══════════════════════════════════════════════════════════ */
const Footer = () => {
  return (
    <footer className="ft-footer">
      <style>{css}</style>

      <div className="ft-inner">
        <div className="ft-grid">

          {/* ── Brand + Newsletter ── */}
          <div>
            <Link to="/" className="ft-brand-logo">Eventraze</Link>
            <p className="ft-brand-desc">
              Stay informed about campus events, workshops, and opportunities — all in one place.
            </p>

            <span className="ft-subscribe-label">Newsletter</span>
            <div className="ft-subscribe-row">
              <input
                type="email"
                placeholder="your@email.com"
                className="ft-subscribe-input"
              />
              <button className="ft-subscribe-btn">Subscribe</button>
            </div>
            <p className="ft-privacy-note">
              By subscribing you agree to our privacy policy and communication terms.
            </p>
          </div>

          {/* ── Quick links ── */}
          <div>
            <h4 className="ft-col-title">Quick links</h4>
            <ul className="ft-col-list">
              <li><Link to="/events"              className="ft-col-link">Events</Link></li>
              <li><Link to="/event-registration"  className="ft-col-link">Registration</Link></li>
              <li><Link to="#"                    className="ft-col-link">Support</Link></li>
              <li><Link to="#"                    className="ft-col-link">FAQ</Link></li>
              <li><Link to="#"                    className="ft-col-link">Contact</Link></li>
            </ul>
          </div>

          {/* ── Resources ── */}
          <div>
            <h4 className="ft-col-title">Resources</h4>
            <ul className="ft-col-list">
              <li><Link to="#" className="ft-col-link">Assistance</Link></li>
              <li><Link to="#" className="ft-col-link">Services</Link></li>
              <li><Link to="#" className="ft-col-link">Guides</Link></li>
              <li><Link to="#" className="ft-col-link">Blog</Link></li>
              <li><Link to="#" className="ft-col-link">Community</Link></li>
            </ul>
          </div>

          {/* ── Follow us ── */}
          <div>
            <h4 className="ft-col-title">Follow us</h4>
            <ul className="ft-col-list">
              <li>
                <Link to="#" className="ft-social-link">
                  <span className="ft-social-icon"><IconFacebook /></span>
                  Facebook
                </Link>
              </li>
              <li>
                <Link to="#" className="ft-social-link">
                  <span className="ft-social-icon"><IconInstagram /></span>
                  Instagram
                </Link>
              </li>
              <li>
                <Link to="#" className="ft-social-link">
                  <span className="ft-social-icon"><IconX /></span>
                  X
                </Link>
              </li>
              <li>
                <Link to="#" className="ft-social-link">
                  <span className="ft-social-icon"><IconLinkedIn /></span>
                  LinkedIn
                </Link>
              </li>
              <li>
                <Link to="#" className="ft-social-link">
                  <span className="ft-social-icon"><IconYouTube /></span>
                  YouTube
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* ── Divider ── */}
        <div className="ft-sep" />

        {/* ── Bottom bar ── */}
        <div className="ft-bottom">
          <p className="ft-copyright">
            © {new Date().getFullYear()} <span>Eventraze</span> · University Event Management Platform
          </p>
          <nav className="ft-legal" aria-label="Legal">
            <Link to="#" className="ft-legal-link">Privacy policy</Link>
            <Link to="#" className="ft-legal-link">Terms of service</Link>
            <Link to="#" className="ft-legal-link">Cookie settings</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;