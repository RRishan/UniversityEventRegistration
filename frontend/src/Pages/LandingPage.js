import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
    return (
        <div className="landing-page">
            <nav className="navbar">
                <div className="logo">Eventraze</div>
                <div className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/events">Events</Link>
                    <Link to="/my-events">My Events</Link>
                    <div className="more-dropdown">More ▾</div>
                </div>
                <Link to="/login" className="login-button">Login</Link>
            </nav>

            <header className="hero-section">
                <div className="hero-content">
                    <div className="hero-card">
                        <h1>Discover and manage university events</h1>
                        <p>Streamline event registration and approval for students, organizers, and faculty. Find, create, and track events with ease.</p>
                        <div className="hero-buttons">
                            <button className="btn-primary">Browse events</button>
                            <button className="btn-secondary">Register</button>
                        </div>
                    </div>
                </div>
                <div className="calendar-widget">
                    <h3>Events dates</h3>
                    <div className="month-selector">
                        <span>&lt;</span>
                        <span>Feburary</span>
                        <span>&gt;</span>
                    </div>
                    <div className="calendar-grid">
                        <div className="day-name">Mo</div><div className="day-name">Tu</div><div className="day-name">We</div><div className="day-name">Th</div><div className="day-name">Fr</div><div className="day-name">Sa</div><div className="day-name">Su</div>
                        {/* Mock Calendar Data */}
                        <div className="day muted">26</div><div className="day muted">27</div><div className="day muted">28</div><div className="day muted">29</div><div className="day muted">30</div>
                        <div className="day">1</div><div className="day">2</div><div className="day">3</div><div className="day">4</div><div className="day">5</div><div className="day">6</div><div className="day">7</div><div className="day">8</div><div className="day">9</div>
                        <div className="day">10</div><div className="day">11</div><div className="day">12</div><div className="day active">13</div><div className="day">14</div><div className="day">15</div><div className="day">16</div>
                        <div className="day">17</div><div className="day">18</div><div className="day">19</div><div className="day">20</div><div className="day">21</div><div className="day">22</div><div className="day">23</div>
                        <div className="day">24</div><div className="day">25</div><div className="day">26</div><div className="day">27</div><div className="day selected">28</div><div className="day">29</div><div className="day">30</div>
                        <div className="day">31</div><div className="day muted">1</div><div className="day muted">2</div><div className="day muted">3</div><div className="day muted">4</div><div className="day muted">5</div><div className="day muted">6</div>
                    </div>
                    <div className="calendar-events">
                        <p>• Feb 13 - BIDWA NADEE</p>
                        <p>• Feb 28 - NAGA</p>
                    </div>
                </div>
            </header>

            <section className="upcoming-events">
                <h2>Upcoming campus events</h2>
                <p className="subtitle">Explore the latest events happening across our university community.</p>
                <div className="events-grid">
                    <div className="event-card">
                        <div className="event-image placeholder-image"></div>
                        <div className="event-details">
                            <span className="tag">Workshops</span> <span className="read-time">5 min read</span>
                            <h3>Leadership development workshop</h3>
                            <p>Join our intensive session on building professional skills and networking strategies.</p>
                            <a href="#" className="read-more">Learn more &gt;</a>
                        </div>
                    </div>
                    <div className="event-card">
                        <div className="event-image placeholder-image"></div>
                        <div className="event-details">
                            <span className="tag">Seminars</span> <span className="read-time">5 min read</span>
                            <h3>Research innovation showcase</h3>
                            <p>Discover groundbreaking student and faculty research projects across disciplines.</p>
                            <a href="#" className="read-more">Learn more &gt;</a>
                        </div>
                    </div>
                    <div className="event-card">
                        <div className="event-image placeholder-image"></div>
                        <div className="event-details">
                            <span className="tag">Socials</span> <span className="read-time">5 min read</span>
                            <h3>Cultural exchange night</h3>
                            <p>Connect with international students and explore diverse cultural experiences.</p>
                            <a href="#" className="read-more">Learn more &gt;</a>
                        </div>
                    </div>
                </div>
                <button className="view-all-btn">View all events</button>
            </section>

            <section className="cta-section">
                <div className="cta-content">
                    <h2>Start managing your events today</h2>
                    <p>Create, track, and engage with campus events through our streamlined platform.</p>
                    <div className="hero-buttons">
                        <button className="btn-primary">Register now</button>
                        <button className="btn-secondary">Learn more</button>
                    </div>
                </div>
            </section>

            <footer className="footer">
                <div className="footer-top">
                    <div className="footer-brand">
                        <div className="logo italic">Logo</div>
                        <p>Stay informed about campus events and opportunities.</p>
                        <div className="subscribe-form">
                            <input type="email" placeholder="Enter your email" />
                            <button>Subscribe</button>
                        </div>
                        <p className="small-text">By subscribing you agree to with our privacy policy and provide consent updates.</p>
                    </div>
                    <div className="footer-links-col">
                        <h4>Quick links</h4>
                        <a href="#">Events</a>
                        <a href="#">Registration</a>
                        <a href="#">Support</a>
                        <a href="#">FAQ</a>
                        <a href="#">Contact</a>
                    </div>
                    <div className="footer-links-col">
                        <h4>Resources</h4>
                        <a href="#">Workshops</a>
                        <a href="#">Seminars</a>
                        <a href="#">Guides</a>
                        <a href="#">Blog</a>
                        <a href="#">Community</a>
                    </div>
                    <div className="footer-links-col">
                        <h4>Follow us</h4>
                        <a href="#">Facebook</a>
                        <a href="#">Instagram</a>
                        <a href="#">X</a>
                        <a href="#">LinkedIn</a>
                        <a href="#">YouTube</a>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© 2024 University Event Management Platform</p>
                    <div className="footer-legal">
                        <a href="#">Privacy policy</a>
                        <a href="#">Terms of service</a>
                        <a href="#">Cookies settings</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
