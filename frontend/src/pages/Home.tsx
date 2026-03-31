import { Link } from "react-router-dom";
import crowdBg from "@/assets/crowd-bg.jpg";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "@/context/AppContext";
import { toast } from "sonner";
import axios from "axios";

/* ─────────────────────────────────────────────────────────────
   STYLES — unified Eventraze dark theatrical design system
───────────────────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=DM+Sans:wght@300;400;500&display=swap');

  .hm-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: #0a0a0b;
    font-family: 'DM Sans', sans-serif;
    color: #f0ede8;
  }

  /* ════════ HERO ════════ */
  .hm-hero {
    position: relative;
    overflow: hidden;
    min-height: 92vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .hm-hero-bg {
    position: absolute; inset: 0;
    background-size: cover;
    background-position: center 30%;
    filter: brightness(0.28) saturate(1.1);
    transform: scale(1.04);
    transition: transform 16s ease;
  }
  .hm-hero:hover .hm-hero-bg { transform: scale(1); }
  .hm-hero-vignette {
    position: absolute; inset: 0;
    background:
      linear-gradient(to bottom, rgba(10,10,11,0.5) 0%, transparent 35%),
      linear-gradient(to top,    rgba(10,10,11,0.85) 0%, transparent 50%),
      linear-gradient(to right,  rgba(10,10,11,0.4) 0%, transparent 60%);
    pointer-events: none;
  }
  .hm-hero-scan {
    position: absolute; inset: 0;
    background-image: repeating-linear-gradient(
      0deg, transparent, transparent 2px,
      rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px
    );
    pointer-events: none; z-index: 1;
  }
  .hm-hero-inner {
    position: relative; z-index: 2;
    max-width: 1160px; margin: 0 auto;
    padding: 6rem 1.5rem 5rem;
    display: grid;
    grid-template-columns: 1fr;
    gap: 3rem;
    align-items: center;
  }
  @media (min-width: 900px) {
    .hm-hero-inner { grid-template-columns: 1fr 1fr; gap: 4rem; }
  }

  /* Hero left */
  .hm-hero-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.68rem; font-weight: 500;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: #ffbe3c;
    background: rgba(255,190,60,0.1);
    border: 1px solid rgba(255,190,60,0.2);
    border-radius: 20px;
    padding: 0.3rem 0.85rem;
    margin-bottom: 1.4rem;
  }
  .hm-eyebrow-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: #ffbe3c;
    animation: hm-pulse 2s ease infinite;
  }
  @keyframes hm-pulse {
    0%,100% { opacity:1; transform:scale(1); }
    50%      { opacity:0.5; transform:scale(0.7); }
  }
  .hm-hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2.8rem, 6vw, 5rem);
    font-weight: 300; line-height: 1.05;
    color: #f0ede8; margin: 0 0 1.3rem;
  }
  .hm-hero-title em { font-style: italic; color: #ffbe3c; }
  .hm-hero-body {
    font-size: 0.92rem; line-height: 1.75;
    color: rgba(240,237,232,0.5);
    max-width: 420px; margin: 0 0 2.2rem;
  }
  .hm-hero-actions { display: flex; flex-wrap: wrap; gap: 0.75rem; }

  /* Buttons */
  .hm-btn-primary {
    padding: 0.78rem 1.6rem;
    background: linear-gradient(135deg, #ffbe3c 0%, #ff8c00 100%);
    color: #0a0a0b;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem; font-weight: 500;
    letter-spacing: 0.08em; text-transform: uppercase;
    border: none; border-radius: 10px; cursor: pointer;
    text-decoration: none;
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 4px 24px rgba(255,190,60,0.3);
    display: inline-flex; align-items: center; gap: 0.5rem;
  }
  .hm-btn-primary:hover {
    opacity: 0.9; transform: translateY(-1px);
    box-shadow: 0 6px 32px rgba(255,190,60,0.45);
  }
  .hm-btn-ghost {
    padding: 0.78rem 1.6rem;
    background: transparent;
    color: rgba(240,237,232,0.7);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem; font-weight: 400;
    letter-spacing: 0.08em; text-transform: uppercase;
    border: 1px solid rgba(255,255,255,0.14);
    border-radius: 10px; cursor: pointer;
    text-decoration: none;
    transition: border-color 0.2s, color 0.2s, background 0.2s;
    display: inline-flex; align-items: center; gap: 0.5rem;
  }
  .hm-btn-ghost:hover {
    border-color: rgba(255,255,255,0.3);
    color: #f0ede8;
    background: rgba(255,255,255,0.05);
  }

  /* Stats strip */
  .hm-hero-stats {
    display: flex; gap: 2rem;
    margin-top: 2.8rem; padding-top: 2rem;
    border-top: 1px solid rgba(255,255,255,0.07);
  }
  .hm-stat-val {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.9rem; font-weight: 400;
    color: #f0ede8; line-height: 1; margin-bottom: 0.2rem;
  }
  .hm-stat-label {
    font-size: 0.68rem; letter-spacing: 0.1em;
    text-transform: uppercase; color: rgba(240,237,232,0.3);
  }

  /* Calendar col */
  .hm-cal-header { margin-bottom: 1.4rem; }
  .hm-cal-label {
    font-size: 0.68rem; font-weight: 500;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: rgba(240,237,232,0.35); margin-bottom: 0.5rem;
  }
  .hm-cal-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.6rem; font-weight: 300; color: #f0ede8;
  }
  .hm-cal-widget {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 18px;
    padding: 1.4rem;
    margin-bottom: 1.2rem;
  }
  .hm-cal-nav {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 1.2rem;
  }
  .hm-cal-nav-btn {
    width: 30px; height: 30px; border-radius: 8px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.07);
    color: rgba(240,237,232,0.4);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: background 0.18s, color 0.18s;
  }
  .hm-cal-nav-btn:hover { background: rgba(255,255,255,0.09); color: #f0ede8; }
  .hm-cal-month {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.1rem; font-weight: 400;
    color: #f0ede8; letter-spacing: 0.04em;
  }
  .hm-cal-grid { display: grid; grid-template-columns: repeat(7,1fr); gap: 2px; }
  .hm-cal-dow {
    text-align: center;
    font-size: 0.62rem; font-weight: 500;
    letter-spacing: 0.08em; text-transform: uppercase;
    color: rgba(240,237,232,0.25); padding: 0.5rem 0;
  }
  .hm-cal-day {
    text-align: center; font-size: 0.78rem;
    padding: 0.5rem 0; border-radius: 7px;
    color: rgba(240,237,232,0.45); cursor: default;
    transition: background 0.15s, color 0.15s;
  }
  .hm-cal-day--clickable { cursor: pointer; }
  .hm-cal-day--clickable:hover { background: rgba(255,255,255,0.07); color: #f0ede8; }
  .hm-cal-day--event {
    background: rgba(255,190,60,0.18); color: #ffbe3c;
    font-weight: 600; cursor: pointer;
    border: 1px solid rgba(255,190,60,0.3);
    box-shadow: 0 0 10px rgba(255,190,60,0.12);
  }
  .hm-cal-day--event:hover { background: rgba(255,190,60,0.28); }

  /* Event pills */
  .hm-event-pills { display: flex; flex-direction: column; gap: 0.55rem; }
  .hm-event-pill {
    display: flex; align-items: center; gap: 0.9rem;
    padding: 0.7rem 1rem;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 10px;
    transition: background 0.18s, border-color 0.18s;
  }
  .hm-event-pill:hover { background: rgba(255,255,255,0.05); border-color: rgba(255,190,60,0.2); }
  .hm-pill-date {
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.95rem; font-weight: 400;
    color: #ffbe3c; min-width: 50px;
  }
  .hm-pill-sep { width: 1px; height: 18px; background: rgba(255,255,255,0.08); }
  .hm-pill-title { font-size: 0.82rem; font-weight: 500; color: rgba(240,237,232,0.7); letter-spacing: 0.04em; }

  /* ════════ EVENTS SECTION ════════ */
  .hm-events-section {
    background: #0d0d0f;
    padding: 6rem 1.5rem;
    border-top: 1px solid rgba(255,255,255,0.04);
  }
  .hm-section-inner { max-width: 1160px; margin: 0 auto; }
  .hm-section-eyebrow {
    display: block;
    font-size: 0.68rem; font-weight: 500;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: #ffbe3c; margin-bottom: 0.65rem;
  }
  .hm-section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 300; line-height: 1.1;
    color: #f0ede8; margin: 0 0 0.5rem;
  }
  .hm-section-sub {
    font-size: 0.82rem; color: rgba(240,237,232,0.35);
    max-width: 420px; line-height: 1.7; margin: 0;
  }
  .hm-section-head {
    display: flex; flex-direction: column;
    gap: 1rem; margin-bottom: 3rem;
  }
  @media (min-width: 680px) {
    .hm-section-head {
      flex-direction: row; align-items: flex-end;
      justify-content: space-between;
    }
  }

  /* Cards */
  .hm-events-grid {
    display: grid; grid-template-columns: 1fr;
    gap: 1.5rem; margin-bottom: 3rem;
  }
  @media (min-width: 560px) { .hm-events-grid { grid-template-columns: repeat(2,1fr); } }
  @media (min-width: 900px) { .hm-events-grid { grid-template-columns: repeat(3,1fr); } }

  .hm-event-card {
    display: block; text-decoration: none;
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 18px; overflow: hidden;
    transition: border-color 0.22s, transform 0.22s, box-shadow 0.22s;
  }
  .hm-event-card:hover {
    border-color: rgba(255,190,60,0.25);
    transform: translateY(-3px);
    box-shadow: 0 16px 50px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,190,60,0.08);
  }
  .hm-card-img-wrap { position: relative; overflow: hidden; height: 200px; }
  .hm-card-img {
    width: 100%; height: 100%; object-fit: cover;
    filter: brightness(0.85) saturate(0.95);
    transition: transform 0.5s ease, filter 0.4s ease;
  }
  .hm-event-card:hover .hm-card-img { transform: scale(1.06); filter: brightness(0.95) saturate(1.05); }
  .hm-card-badge {
    position: absolute; top: 0.9rem; left: 0.9rem;
    font-size: 0.62rem; font-weight: 500;
    letter-spacing: 0.08em; text-transform: uppercase;
    padding: 0.22rem 0.65rem;
    background: rgba(10,10,11,0.75);
    border: 1px solid rgba(255,190,60,0.3);
    color: #ffbe3c; border-radius: 20px;
    backdrop-filter: blur(6px);
  }
  .hm-card-body { padding: 1.3rem 1.4rem 1.5rem; }
  .hm-card-read { font-size: 0.68rem; color: rgba(240,237,232,0.28); letter-spacing: 0.04em; margin-bottom: 0.65rem; }
  .hm-card-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.2rem; font-weight: 400; line-height: 1.3;
    color: #f0ede8; margin: 0 0 0.6rem;
    transition: color 0.18s;
  }
  .hm-event-card:hover .hm-card-title { color: #ffbe3c; }
  .hm-card-desc {
    font-size: 0.78rem; line-height: 1.65;
    color: rgba(240,237,232,0.35);
    margin: 0 0 1.1rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .hm-card-cta {
    display: inline-flex; align-items: center; gap: 0.4rem;
    font-size: 0.75rem; font-weight: 500;
    letter-spacing: 0.06em; text-transform: uppercase;
    color: rgba(240,237,232,0.35);
    transition: color 0.18s, gap 0.18s;
  }
  .hm-event-card:hover .hm-card-cta { color: #ffbe3c; gap: 0.65rem; }
  .hm-card-cta svg { width: 13px; height: 13px; }

  .hm-events-foot { text-align: center; }
  .hm-view-all {
    display: inline-flex; align-items: center; gap: 0.6rem;
    padding: 0.78rem 1.8rem;
    background: transparent;
    color: rgba(240,237,232,0.55);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.8rem; font-weight: 400;
    letter-spacing: 0.1em; text-transform: uppercase;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px; text-decoration: none;
    transition: border-color 0.2s, color 0.2s, background 0.2s;
  }
  .hm-view-all:hover { border-color: rgba(255,255,255,0.24); color: #f0ede8; background: rgba(255,255,255,0.04); }

  /* ════════ CTA ════════ */
  .hm-cta-section { position: relative; overflow: hidden; padding: 7rem 1.5rem; }
  .hm-cta-bg {
    position: absolute; inset: 0;
    background-size: cover; background-position: center 40%;
    filter: brightness(0.2) saturate(0.8);
    transform: scale(1.04);
  }
  .hm-cta-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(10,10,11,0.75) 0%, rgba(10,10,11,0.45) 100%);
  }
  .hm-cta-slash {
    position: absolute; inset: 0;
    background: linear-gradient(115deg, transparent 35%, rgba(255,190,60,0.04) 50%, transparent 65%);
    pointer-events: none;
  }
  .hm-cta-scan {
    position: absolute; inset: 0;
    background-image: repeating-linear-gradient(
      0deg, transparent, transparent 2px,
      rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px
    );
    pointer-events: none;
  }
  .hm-cta-inner {
    position: relative; z-index: 1;
    max-width: 640px; margin: 0 auto; text-align: center;
  }
  .hm-cta-eyebrow {
    display: inline-block;
    font-size: 0.68rem; font-weight: 500;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: #ffbe3c; margin-bottom: 1.2rem;
  }
  .hm-cta-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2.2rem, 5vw, 3.8rem);
    font-weight: 300; line-height: 1.1;
    color: #f0ede8; margin: 0 0 1rem;
  }
  .hm-cta-title em { font-style: italic; color: #ffbe3c; }
  .hm-cta-body {
    font-size: 0.88rem; line-height: 1.75;
    color: rgba(240,237,232,0.45);
    max-width: 420px; margin: 0 auto 2.4rem;
  }
  .hm-cta-actions { display: flex; flex-wrap: wrap; gap: 0.75rem; justify-content: center; }
`;

/* ── Calendar data (unchanged) ──────────────────────────────── */
const calendarEvents: Record<string, { title: string; time: string; location: string }> = {
  "13": { title: "KIZUNA KIOKO", time: "7:00 PM - 10:00 PM", location: "Main Auditorium" },
  "24": { title: "INNA",         time: "8:00 PM - 11:00 PM", location: "Campus Ground" },
};

const calendarDays = [
  {day:"",highlighted:false},{day:"",highlighted:false},
  {day:"1",highlighted:false},{day:"2",highlighted:false},{day:"3",highlighted:false},
  {day:"4",highlighted:false},{day:"5",highlighted:false},{day:"6",highlighted:false},
  {day:"7",highlighted:false},{day:"8",highlighted:false},{day:"9",highlighted:false},
  {day:"10",highlighted:false},{day:"11",highlighted:false},{day:"12",highlighted:false},
  {day:"13",highlighted:true},{day:"14",highlighted:false},{day:"15",highlighted:false},
  {day:"16",highlighted:false},{day:"17",highlighted:false},{day:"18",highlighted:false},
  {day:"19",highlighted:false},{day:"20",highlighted:false},{day:"21",highlighted:false},
  {day:"22",highlighted:false},{day:"23",highlighted:false},{day:"24",highlighted:true},
  {day:"25",highlighted:false},{day:"26",highlighted:false},{day:"27",highlighted:false},
  {day:"28",highlighted:false},{day:"29",highlighted:false},
  {day:"",highlighted:false},{day:"",highlighted:false},{day:"",highlighted:false},{day:"",highlighted:false},
];

/* ── CalendarDay ─────────────────────────────────────────── */
const CalendarDay = ({ day, highlighted }: { day: string; highlighted: boolean }) => {
  if (!day) return <div className="hm-cal-day" />;

  if (highlighted && calendarEvents[day]) {
    const event = calendarEvents[day];
    return (
      <HoverCard openDelay={100} closeDelay={100}>
        <HoverCardTrigger asChild>
          <div className="hm-cal-day hm-cal-day--event">{day}</div>
        </HoverCardTrigger>
        <HoverCardContent
          side="top" align="center"
          style={{
            background: "#111113", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "14px", boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
            color: "#f0ede8", padding: "1rem 1.1rem", minWidth: "210px",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"0.35rem" }}>
            <span style={{ width:8, height:8, borderRadius:"50%", background:"#ffbe3c", flexShrink:0, display:"inline-block" }} />
            <span style={{ fontSize:"0.68rem", letterSpacing:"0.08em", textTransform:"uppercase", color:"rgba(240,237,232,0.35)" }}>
              Feb {day}
            </span>
          </div>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.1rem", fontWeight:400, color:"#f0ede8", margin:"0.4rem 0 0.6rem" }}>
            {event.title}
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:"0.35rem", marginBottom:"0.8rem" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", fontSize:"0.76rem", color:"rgba(240,237,232,0.4)" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
              </svg>
              {event.time}
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", fontSize:"0.76rem", color:"rgba(240,237,232,0.4)" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              {event.location}
            </div>
          </div>
          <Link to={`/event/${day}`} style={{ fontSize:"0.75rem", fontWeight:500, color:"#ffbe3c", textDecoration:"none", display:"inline-flex", alignItems:"center", gap:"0.3rem" }}>
            View details
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6"/>
            </svg>
          </Link>
        </HoverCardContent>
      </HoverCard>
    );
  }

  return <div className={`hm-cal-day ${day ? "hm-cal-day--clickable" : ""}`}>{day}</div>;
};

/* ═══════════════════════════════════════════════════════════ */
const Home = () => {
  const { isLoggedIn, backendUrl } = useContext(AppContext);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  const getAllEvents = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.get(backendUrl + "/api/event/events");
      if (data.success) {
        const formattedEvents = data.message.map((event: any) => ({
          id: event._id,
          title: event.eventTitle,
          description: event.description,
          image: event.imageLink,
          category: event.category.charAt(0).toUpperCase() + event.category.slice(1),
          readTime: `${Math.ceil(event.expectedAttendees / 10)} min read`,
        }));
        setUpcomingEvents(formattedEvents);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => { getAllEvents(); }, []);

  return (
    <div className="hm-page">
      <style>{css}</style>
      <Header />

      {/* ── HERO ── */}
      <section className="hm-hero">
        <div className="hm-hero-bg" style={{ backgroundImage: `url(${crowdBg})` }} />
        <div className="hm-hero-vignette" />
        <div className="hm-hero-scan" />

        <div className="hm-hero-inner">
          {/* Left */}
          <div>
            <div className="hm-hero-eyebrow">
              <span className="hm-eyebrow-dot" />
              University Events Platform
            </div>
            <h1 className="hm-hero-title">
              Discover &amp; manage<br /><em>campus events</em>
            </h1>
            <p className="hm-hero-body">
              Streamline event registration and approval for students, organizers,
              and faculty. Find, create, and track events with ease.
            </p>
            <div className="hm-hero-actions">
              <Link to="/events" className="hm-btn-primary">
                Browse events
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6"/>
                </svg>
              </Link>
              {!isLoggedIn && (
                <Link to="/event-registration" className="hm-btn-ghost">Register</Link>
              )}
            </div>
            <div className="hm-hero-stats">
              <div>
                <div className="hm-stat-val">200+</div>
                <div className="hm-stat-label">Events / year</div>
              </div>
              <div>
                <div className="hm-stat-val">5k+</div>
                <div className="hm-stat-label">Attendees</div>
              </div>
              <div>
                <div className="hm-stat-val">40+</div>
                <div className="hm-stat-label">Organizers</div>
              </div>
            </div>
          </div>

          {/* Right: Calendar */}
          <div>
            <div className="hm-cal-header">
              <div className="hm-cal-label">Schedule</div>
              <div className="hm-cal-title">Events dates</div>
            </div>
            <div className="hm-cal-widget">
              <div className="hm-cal-nav">
                <button className="hm-cal-nav-btn" aria-label="Previous month">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 19l-7-7 7-7"/>
                  </svg>
                </button>
                <span className="hm-cal-month">February</span>
                <button className="hm-cal-nav-btn" aria-label="Next month">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
              <div className="hm-cal-grid" style={{ marginBottom: "0.4rem" }}>
                {["Mo","Tu","We","Th","Fr","Sa","Su"].map((d) => (
                  <div key={d} className="hm-cal-dow">{d}</div>
                ))}
              </div>
              <div className="hm-cal-grid">
                {calendarDays.map((item, i) => (
                  <CalendarDay key={i} day={item.day} highlighted={item.highlighted} />
                ))}
              </div>
            </div>
            <div className="hm-event-pills">
              <div className="hm-event-pill">
                <span className="hm-pill-date">Feb 13</span>
                <span className="hm-pill-sep" />
                <span className="hm-pill-title">KIZUNA KIOKO</span>
              </div>
              <div className="hm-event-pill">
                <span className="hm-pill-date">Feb 20</span>
                <span className="hm-pill-sep" />
                <span className="hm-pill-title">INNA</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── UPCOMING EVENTS ── */}
      <section className="hm-events-section">
        <div className="hm-section-inner">
          <div className="hm-section-head">
            <div>
              <span className="hm-section-eyebrow">What's on</span>
              <h2 className="hm-section-title">Upcoming campus events</h2>
              <p className="hm-section-sub">
                Explore the latest events happening across our university community.
              </p>
            </div>
            <Link to="/events" className="hm-view-all" style={{ alignSelf: "flex-end" }}>
              View all
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6"/>
              </svg>
            </Link>
          </div>

          <div className="hm-events-grid">
            {upcomingEvents.map((event: any) => (
              <Link key={event.id} to={`/event/${event.id}`} className="hm-event-card">
                <div className="hm-card-img-wrap">
                  <img src={event.image} alt={event.title} className="hm-card-img" />
                  <span className="hm-card-badge">{event.category}</span>
                </div>
                <div className="hm-card-body">
                  <div className="hm-card-read">{event.readTime}</div>
                  <h3 className="hm-card-title">{event.title}</h3>
                  <p className="hm-card-desc">{event.description}</p>
                  <span className="hm-card-cta">
                    Learn more
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6"/>
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="hm-events-foot">
            <Link to="/events" className="hm-view-all">
              View all events
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="hm-cta-section">
        <div className="hm-cta-bg" style={{ backgroundImage: `url(${crowdBg})` }} />
        <div className="hm-cta-overlay" />
        <div className="hm-cta-slash" />
        <div className="hm-cta-scan" />
        <div className="hm-cta-inner">
          <span className="hm-cta-eyebrow">Get started today</span>
          <h2 className="hm-cta-title">
            Start managing your<br /><em>events today</em>
          </h2>
          <p className="hm-cta-body">
            Create, track, and engage with campus events through our streamlined platform.
          </p>
          <div className="hm-cta-actions">
            <Link to="/event-registration" className="hm-btn-primary">
              Register now
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6"/>
              </svg>
            </Link>
            <Link to="/events" className="hm-btn-ghost">Learn more</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;