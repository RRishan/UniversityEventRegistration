import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './EventsPage.css';
import './LandingPage.css'; // Reusing some footer/navbar styles

const EventsPage = () => {
    const navigate = useNavigate();

    const featuredEvents = [
        {
            id: 1,
            title: "Annual Tech Symposium",
            date: "March 15, 2025",
            time: "10:00 AM - 4:00 PM",
            location: "Main Auditorium",
            category: "Academic",
            image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070"
        },
        {
            id: 2,
            title: "Cultural Night 2025",
            date: "March 20, 2025",
            time: "6:00 PM - 10:00 PM",
            location: "Open Grounds",
            category: "Cultural",
            image: "https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=2070"
        },
        {
            id: 3,
            title: "Sports Tournament",
            date: "March 25, 2025",
            time: "8:00 AM - 5:00 PM",
            location: "Sports Complex",
            category: "Sports",
            image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=2070"
        }
    ];

    const allEvents = [
        {
            id: 101,
            title: "Workshop on AI Ethics",
            date: "April 5, 2025",
            time: "2:00 PM - 5:00 PM",
            location: "Conference Hall A",
            club: "Computer Science Club",
            status: "Filling",
            category: "Academic"
        },
        {
            id: 102,
            title: "Alumni Networking Event",
            date: "April 8, 2025",
            time: "7:00 PM - 10:00 PM",
            location: "Faculty Lounge",
            club: "Alumni Association",
            status: "Registered",
            category: "Networking"
        },
        {
            id: 103,
            title: "Research Paper Presentation",
            date: "April 10, 2025",
            time: "11:00 AM - 1:00 PM",
            location: "Seminar Hall B",
            club: "Research Society",
            status: "Registered", // Using Blue for "Registered" as per image
            category: "Academic"
        },
        {
            id: 104,
            title: "Photography Contest",
            date: "April 15, 2025",
            time: "9:00 AM - 5:00 PM",
            location: "Campus Grounds",
            club: "Photography Club",
            status: "Closed",
            category: "Cultural"
        }
    ];

    return (
        <div className="events-page">
            {/* Navbar (Reused) */}
            <nav className="navbar">
                <div className="logo">Eventraze</div>
                <div className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/events" style={{ fontWeight: 'bold' }}>Events</Link>
                    <Link to="/my-events">My Events</Link>
                    <div className="more-dropdown">More ▾</div>
                </div>
                <Link to="/login" className="login-button">Login/Logout</Link>
            </nav>

            {/* Featured Events */}
            <section className="featured-section">
                <h2>Featured Events</h2>
                <div className="featured-grid">
                    {featuredEvents.map(event => (
                        <div key={event.id} className="featured-card">
                            <div className="featured-image" style={{ backgroundImage: `url(${event.image})` }}></div>
                            <div className="featured-details">
                                <h3>{event.title}</h3>
                                <p>📅 {event.date}</p>
                                <p>🕒 {event.time}</p>
                                <p>📍 {event.location}</p>
                                <span className={`badge ${event.category.toLowerCase()}`}>{event.category}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Main Content */}
            <div className="main-content">
                {/* Sidebar */}
                <aside className="filter-sidebar">
                    <h3>Filters</h3>
                    <div className="filter-group">
                        <label>Search Events</label>
                        <input type="text" placeholder="Search..." />
                    </div>
                    <div className="filter-group">
                        <label>Category</label>
                        <select>
                            <option>All Categories</option>
                            <option>Academic</option>
                            <option>Cultural</option>
                            <option>Sports</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label>Venue</label>
                        <select>
                            <option>All Venues</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label>Date Range</label>
                        <input type="date" placeholder="Start Date" style={{ marginBottom: '5px' }} />
                        <input type="date" placeholder="End Date" />
                    </div>
                    <button className="apply-btn">Apply Filters</button>
                </aside>

                {/* Event List */}
                <div className="event-list-container">
                    <div className="list-header">
                        <h2>All Events</h2>
                        <div className="sort-options">
                            <button>Sort by Date ▾</button>
                            <button>📅</button>
                        </div>
                    </div>

                    <div className="events-grid-list">
                        {allEvents.map(event => (
                            <div key={event.id} className="event-card">
                                <span className={`status-badge ${event.status.toLowerCase()}`}>{event.status}</span>
                                <div className="event-list-details">
                                    <h4>{event.title}</h4>
                                    <div className="event-meta">
                                        <div>📅 {event.date}</div>
                                        <div>🕒 {event.time}</div>
                                        <div>📍 {event.location}</div>
                                        <div>👤 {event.club}</div>
                                    </div>
                                    <span className="badge">{event.category}</span>
                                </div>
                                <div className="card-footer">
                                    <button>View Details</button>
                                    <button style={{ color: event.status === 'Closed' ? 'gray' : '#3b82f6' }}>
                                        {event.status === 'Closed' ? 'Unavailable' : 'Register'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pagination">
                        <button>Previous</button>
                        <button className="active">1</button>
                        <button>2</button>
                        <button>3</button>
                        <button>Next</button>
                    </div>
                </div>
            </div>

            {/* Register Banner */}
            <section className="register-banner">
                <div className="banner-content">
                    <h2>Register your event</h2>
                    <p>Build your event from the ground up with our streamlined registration wizard. Five simple steps get you from concept to confirmation.</p>
                    <div className="banner-buttons">
                        <button className="btn-primary" onClick={() => navigate('/events/register')}>Start</button>
                        <button className="btn-secondary">Learn</button>
                    </div>
                </div>
            </section>

            {/* Process Flow */}
            <div className="process-flow">
                <div className="process-step">
                    <div className="step-circle">login</div>
                    <div className="step-icon">⬇</div>
                </div>
                <div className="process-step">
                    <div className="step-circle">fill event details</div>
                    <div className="step-icon">➡</div>
                </div>
                <div className="process-step">
                    <div className="step-circle">publish</div>
                    <div className="step-icon">⬆</div>
                </div>
                <div className="process-step">
                    <div className="step-circle">click register event</div>
                    <div className="step-icon">➡</div>
                </div>
                <div className="process-step">
                    <div className="step-circle">waiting for approval</div>
                    <div className="step-icon">★</div>
                </div>
                <div className="flow-line"></div>
            </div>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-top">
                    <div className="footer-brand">
                        <div className="logo italic">Logo</div>
                        <p>Stay informed about campus events and opportunities.</p>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© 2024 University Event Management Platform</p>
                </div>
            </footer>
        </div>
    );
};

export default EventsPage;
