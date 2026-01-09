import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState(new Date());

    // Calendar Helpers
    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year, month) => {
        // 0 = Sunday, 1 = Monday... 6 = Saturday
        // We want Monday = 0, Sunday = 6 for our grid which starts with Mo
        let day = new Date(year, month, 1).getDay();
        return day === 0 ? 6 : day - 1;
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const renderCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);

        // Previous month padding
        const daysInPrevMonth = getDaysInMonth(year, month - 1);
        const paddingDays = [];
        for (let i = 0; i < firstDay; i++) {
            paddingDays.push(
                <div key={`pad-${i}`} className="day muted">
                    {daysInPrevMonth - firstDay + i + 1}
                </div>
            );
        }

        // Current month days
        const monthDays = [];
        const today = new Date();
        const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;

        for (let i = 1; i <= daysInMonth; i++) {
            const isToday = isCurrentMonth && today.getDate() === i;
            monthDays.push(
                <div key={`day-${i}`} className={`day ${isToday ? 'active' : ''}`}>
                    {i}
                </div>
            );
        }

        // Next month padding (to fill 42 cells grid 6x7)
        const totalSlots = paddingDays.length + monthDays.length;
        const nextMonthPadding = [];
        const remainingSlots = 42 - totalSlots; // Optional: Fixed height calendar

        for (let i = 1; i <= remainingSlots; i++) {
            nextMonthPadding.push(
                <div key={`next-pad-${i}`} className="day muted">
                    {i}
                </div>
            );
        }

        return [...paddingDays, ...monthDays, ...nextMonthPadding];
    };

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

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
                            <button className="btn-primary" onClick={() => navigate('/events')}>Browse events</button>
                            <button className="btn-secondary" onClick={() => navigate('/events/register')}>Register</button>
                        </div>
                    </div>
                </div>
                <div className="calendar-widget">
                    <h3>{currentDate.getFullYear()}</h3>
                    <div className="month-selector">
                        <span onClick={handlePrevMonth} style={{ cursor: 'pointer' }}>&lt;</span>
                        <span>{monthNames[currentDate.getMonth()]}</span>
                        <span onClick={handleNextMonth} style={{ cursor: 'pointer' }}>&gt;</span>
                    </div>
                    <div className="calendar-grid">
                        <div className="day-name">Mo</div><div className="day-name">Tu</div><div className="day-name">We</div><div className="day-name">Th</div><div className="day-name">Fr</div><div className="day-name">Sa</div><div className="day-name">Su</div>
                        {renderCalendarDays()}
                    </div>
                    <div className="calendar-events">
                        {/* Placeholder for real events linked to dates */}
                        <p>• Select a date to view events</p>
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
                <button className="view-all-btn" onClick={() => navigate('/events')}>View all events</button>
            </section>

            <section className="cta-section">
                <div className="cta-content">
                    <h2>Start managing your events today</h2>
                    <p>Create, track, and engage with campus events through our streamlined platform.</p>
                    <div className="hero-buttons">
                        <button className="btn-primary" onClick={() => navigate('/events/register')}>Register now</button>
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
