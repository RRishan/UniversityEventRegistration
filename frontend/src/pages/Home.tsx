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

/* ─────────────────────────────────────────
   STATIC CALENDAR DATA (unchanged)
───────────────────────────────────────── */
const calendarEvents: Record<string, { title: string; time: string; location: string }> = {
  "13": { title: "KIZUNA KIOKO", time: "7:00 PM - 10:00 PM", location: "Main Auditorium" },
  "24": { title: "INNA",         time: "8:00 PM - 11:00 PM", location: "Campus Ground"   },
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
  {day:"",highlighted:false},{day:"",highlighted:false},
  {day:"",highlighted:false},{day:"",highlighted:false},
];

/* ─────────────────────────────────────────
   ICONS
───────────────────────────────────────── */
const ArrowIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
const ClockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
  </svg>
);
const PinIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const ChevronLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 19l-7-7 7-7" />
  </svg>
);
const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 5l7 7-7 7" />
  </svg>
);
const IconSparkle = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
  </svg>
);
const IconUsers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconCalendar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);
const IconTrophy = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16M8 22v-5M16 22v-5M12 17c-4 0-7-3-7-7V4h14v6c0 4-3 7-7 7z" />
  </svg>
);

/* ─────────────────────────────────────────
   CALENDAR DAY
───────────────────────────────────────── */
const CalendarDay = ({ day, highlighted }: { day: string; highlighted: boolean }) => {
  if (!day) return <div className="text-center py-2 text-sm" />;

  if (highlighted && calendarEvents[day]) {
    const event = calendarEvents[day];
    return (
      <HoverCard openDelay={100} closeDelay={100}>
        <HoverCardTrigger asChild>
          <div className="text-center text-sm py-2 rounded-xl cursor-pointer font-bold
            bg-gradient-to-br from-blue-500 to-indigo-500 text-white
            shadow-[0_4px_12px_rgba(59,130,246,0.35)]
            hover:shadow-[0_6px_20px_rgba(59,130,246,0.45)] hover:scale-110
            transition-all duration-200 relative">
            {day}
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-sky-400 border-2 border-white
              animate-pulse" />
          </div>
        </HoverCardTrigger>

        <HoverCardContent side="top" align="center"
          className="w-60 p-4 bg-white border border-slate-200/80 rounded-2xl
            shadow-[0_20px_60px_rgba(59,130,246,0.15),0_4px_16px_rgba(0,0,0,0.08)]
            font-body text-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
              <IconCalendar />
            </span>
            <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-blue-500">
              Feb {day}
            </span>
          </div>
          <p className="font-display text-lg font-medium text-slate-800 mb-2">{event.title}</p>
          <div className="flex flex-col gap-1.5 mb-3">
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <ClockIcon /> {event.time}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <PinIcon /> {event.location}
            </div>
          </div>
          <Link to={`/event/${day}`}
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-blue-500 hover:text-blue-700 transition-colors">
            View details <ArrowIcon size={11} />
          </Link>
        </HoverCardContent>
      </HoverCard>
    );
  }

  return (
    <div className="text-center text-sm py-2 rounded-xl text-slate-400 cursor-pointer
      hover:bg-blue-50 hover:text-blue-600
      transition-all duration-150">
      {day}
    </div>
  );
};

/* ─────────────────────────────────────────
   MAIN HOME COMPONENT
───────────────────────────────────────── */
const Home = () => {
  const { isLoggedIn, backendUrl } = useContext(AppContext);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);

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
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => { getAllEvents(); }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Playfair Display', Georgia, serif; }
        .font-body    { font-family: 'DM Sans', system-ui, sans-serif; }

        .home-root { font-family: 'DM Sans', system-ui, sans-serif; }

        /* ── Hero ── */
        .hero-section {
          position: relative;
          overflow: hidden;
          min-height: 92vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: linear-gradient(160deg, #0f172a 0%, #1e1b4b 40%, #0c1445 100%);
        }

        .hero-img {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover; object-position: center 30%;
          filter: brightness(0.22) saturate(1.1);
          transform: scale(1.06);
          animation: heroBreath 20s ease-in-out infinite alternate;
        }
        @keyframes heroBreath {
          from { transform: scale(1.06); }
          to   { transform: scale(1.01) translateY(-8px); }
        }

        .hero-gradient {
          position: absolute; inset: 0;
          background:
            linear-gradient(to bottom, rgba(15,23,42,0.55) 0%, transparent 30%),
            linear-gradient(to top,    rgba(15,23,42,0.90) 0%, transparent 55%),
            linear-gradient(135deg, rgba(37,99,235,0.25) 0%, transparent 50%),
            linear-gradient(to right,  rgba(15,23,42,0.45) 0%, transparent 55%);
        }

        /* Animated hero mesh */
        .hero-mesh {
          position: absolute; inset: 0;
          opacity: 0.04;
          background-image:
            linear-gradient(rgba(147,197,253,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(147,197,253,1) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
        }

        /* Hero blobs */
        .hero-blob {
          position: absolute; border-radius: 50%; pointer-events: none;
        }
        .hero-blob-1 {
          top: -10%; right: 5%; width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%);
          animation: blobDrift1 18s ease-in-out infinite;
        }
        .hero-blob-2 {
          bottom: 5%; left: 5%; width: 350px; height: 350px;
          background: radial-gradient(circle, rgba(99,102,241,0.14) 0%, transparent 70%);
          animation: blobDrift2 24s ease-in-out infinite;
        }
        @keyframes blobDrift1 {
          0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-40px,30px) scale(1.08)}
        }
        @keyframes blobDrift2 {
          0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(50px,-40px) scale(1.1)}
        }

        /* Floating particles */
        .particle {
          position: absolute; border-radius: 50%;
          background: rgba(147,197,253,0.4);
          animation: particleRise linear infinite;
          pointer-events: none;
        }
        @keyframes particleRise {
          0%   { transform:translateY(0) scale(1); opacity:0; }
          10%  { opacity:1; }
          90%  { opacity:0.2; }
          100% { transform:translateY(-110px) scale(0.3); opacity:0; }
        }

        /* Eyebrow pill */
        .eyebrow-pill {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(59,130,246,0.15);
          border: 1px solid rgba(96,165,250,0.3);
          backdrop-filter: blur(8px);
          border-radius: 999px;
          padding: 6px 16px;
          animation: fadeUp 0.7s cubic-bezier(0.4,0,0.2,1) 0.1s both;
        }
        .pulse-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #60a5fa;
          animation: pulseDot 2s ease infinite;
        }
        @keyframes pulseDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.6)} }

        /* Hero text animations */
        @keyframes fadeUp {
          from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)}
        }
        .hero-title   { animation: fadeUp 0.8s cubic-bezier(0.4,0,0.2,1) 0.20s both; }
        .hero-body    { animation: fadeUp 0.8s cubic-bezier(0.4,0,0.2,1) 0.32s both; }
        .hero-actions { animation: fadeUp 0.8s cubic-bezier(0.4,0,0.2,1) 0.44s both; }
        .hero-stats   { animation: fadeUp 0.8s cubic-bezier(0.4,0,0.2,1) 0.56s both; }
        .hero-cal     { animation: fadeUp 0.8s cubic-bezier(0.4,0,0.2,1) 0.30s both; }

        /* ── Buttons ── */
        .btn-primary {
          display:inline-flex; align-items:center; gap:8px;
          background: linear-gradient(135deg, #2563eb 0%, #3b82f6 60%, #0ea5e9 100%);
          box-shadow: 0 4px 20px rgba(59,130,246,0.35);
          color: white; border-radius: 12px;
          transition: all 0.22s cubic-bezier(0.4,0,0.2,1);
          position: relative; overflow: hidden;
        }
        .btn-primary::before {
          content:''; position:absolute; inset:0;
          background: linear-gradient(135deg,#1d4ed8,#2563eb);
          opacity:0; transition:opacity 0.22s;
        }
        .btn-primary:hover::before { opacity:1; }
        .btn-primary:hover { transform:translateY(-2px); box-shadow:0 10px 30px rgba(59,130,246,0.45); }
        .btn-primary span { position:relative; z-index:1; }

        /* Shine */
        .btn-shine {
          position:absolute; inset:0;
          background: linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.1) 50%,transparent 60%);
          background-size:200% 100%;
          animation: shine 3s linear infinite;
        }
        @keyframes shine { from{background-position:200% 0} to{background-position:-200% 0} }

        .btn-ghost {
          display:inline-flex; align-items:center; gap:8px;
          background: rgba(255,255,255,0.08);
          border: 1.5px solid rgba(255,255,255,0.2);
          color: rgba(255,255,255,0.8);
          border-radius: 12px;
          backdrop-filter: blur(8px);
          transition: all 0.22s;
        }
        .btn-ghost:hover {
          background: rgba(255,255,255,0.14);
          border-color: rgba(255,255,255,0.35);
          color: white;
          transform: translateY(-1px);
        }

        /* ── Calendar ── */
        .calendar-card {
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(16px);
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.05) inset;
        }

        /* ── Event cards ── */
        .event-card {
          background: white;
          border: 1px solid rgba(226,232,240,0.8);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04), 0 8px 24px rgba(59,130,246,0.05);
          transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
        }
        .event-card:hover {
          border-color: rgba(59,130,246,0.3);
          transform: translateY(-5px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.06), 0 24px 48px rgba(59,130,246,0.12);
        }
        .event-card:hover .card-arrow { transform: translateX(4px); }
        .card-arrow { transition: transform 0.2s; }

        /* ── Sections ── */
        .events-section {
          background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
          position: relative;
        }
        .events-section::before {
          content:'';
          position: absolute; top:0; left:0; right:0; height:4px;
          background: linear-gradient(90deg, #2563eb, #818cf8, #0ea5e9);
        }

        /* CTA section */
        .cta-section {
          position: relative; overflow: hidden;
          background: linear-gradient(160deg, #0f172a 0%, #1e1b4b 50%, #0c1445 100%);
        }
        .cta-img {
          position: absolute; inset: 0;
          width:100%; height:100%;
          object-fit:cover; object-position: center 40%;
          filter: brightness(0.2) saturate(0.8);
        }
        .cta-gradient {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(15,23,42,0.80) 0%, rgba(37,99,235,0.25) 50%, rgba(15,23,42,0.70) 100%);
        }

        /* Stats counter animation */
        .stat-num {
          background: linear-gradient(135deg, #f8fafc, #e0f2fe);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Scroll indicator */
        .scroll-hint {
          animation: scrollBounce 2.5s ease-in-out infinite;
        }
        @keyframes scrollBounce {
          0%,100%{transform:translateY(0)} 50%{transform:translateY(6px)}
        }

        /* Section stagger */
        .stagger-1{animation-delay:0.05s} .stagger-2{animation-delay:0.12s}
        .stagger-3{animation-delay:0.19s} .stagger-4{animation-delay:0.26s}
        .stagger-5{animation-delay:0.33s} .stagger-6{animation-delay:0.40s}
        .cards-fade {
          animation: fadeUp 0.6s cubic-bezier(0.4,0,0.2,1) both;
        }

        /* Dot grid on events section */
        .dot-grid {
          position: absolute; inset: 0; pointer-events: none; z-index: 0;
          opacity: 0.025;
          background-image: radial-gradient(#1e40af 1px, transparent 1px);
          background-size: 28px 28px;
        }
      `}</style>

      <div className="home-root min-h-screen flex flex-col bg-slate-50">
        <Header />

        {/* ══════════════════════════════════════
            HERO SECTION
        ══════════════════════════════════════ */}
        <section className="hero-section">
          {/* Background */}
          <img src={crowdBg} alt="" className="hero-img" aria-hidden="true" />
          <div className="hero-gradient" />
          <div className="hero-mesh" />
          <div className="hero-blob hero-blob-1" />
          <div className="hero-blob hero-blob-2" />

          {/* Particles */}
          {[
            {s:5,x:8,  d:0,   dur:10},{s:3,x:20, d:2.5,dur:13},
            {s:6,x:38, d:1,   dur:9 },{s:4,x:55, d:3.5,dur:12},
            {s:3,x:72, d:0.5, dur:11},{s:5,x:85, d:4,  dur:14},
            {s:4,x:92, d:1.5, dur:10},{s:3,x:48, d:5,  dur:15},
          ].map((p,i) => (
            <div key={i} className="particle" style={{
              width:p.s, height:p.s, left:`${p.x}%`, bottom:"5%",
              animationDelay:`${p.d}s`, animationDuration:`${p.dur}s`,
            }} />
          ))}

          {/* Content */}
          <div className="relative z-10 max-w-[1200px] mx-auto w-full px-6 py-20
            grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* ── Left ── */}
            <div>
              {/* Eyebrow */}
              <div className="eyebrow-pill mb-6">
                <div className="pulse-dot" />
                <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-blue-300">
                  University Events Platform
                </span>
              </div>

              {/* Title */}
              <h1 className="hero-title font-display font-medium text-white leading-[1.08] mb-5"
                style={{ fontSize: "clamp(2.6rem,5.5vw,4.5rem)" }}>
                Discover &amp; manage<br />
                <em className="italic not-italic" style={{
                  background: "linear-gradient(135deg, #60a5fa, #a5b4fc)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>
                  campus events
                </em>
              </h1>

              {/* Body */}
              <p className="hero-body text-[0.95rem] leading-[1.75] text-white/55 max-w-md mb-9">
                Streamline event registration and approval for students, organizers,
                and faculty. Find, create, and track events with ease.
              </p>

              {/* Actions */}
              <div className="hero-actions flex flex-wrap gap-3">
                <Link to="/events" className="btn-primary px-7 py-3 text-[13px] font-semibold tracking-wide">
                  <div className="btn-shine" />
                  <span>Browse events</span>
                  <span><ArrowIcon /></span>
                </Link>
                {!isLoggedIn && (
                  <Link to="/event-registration" className="btn-ghost px-7 py-3 text-[13px] font-medium tracking-wide">
                    Register now
                  </Link>
                )}
              </div>

              {/* Stats */}
              <div className="hero-stats flex gap-8 mt-10 pt-8 border-t border-white/[0.08]">
                {[
                  { val: "200+", label: "Events / year", icon: <IconCalendar /> },
                  { val: "5k+",  label: "Attendees",     icon: <IconUsers />    },
                  { val: "40+",  label: "Organizers",    icon: <IconTrophy />   },
                ].map(({ val, label, icon }) => (
                  <div key={label} className="group">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-blue-400 opacity-60">{icon}</span>
                    </div>
                    <div className="stat-num font-display text-[2rem] font-medium leading-none mb-1">
                      {val}
                    </div>
                    <div className="text-[11px] tracking-[0.1em] uppercase text-white/35">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: Calendar ── */}
            <div className="hero-cal">
              <div className="mb-5">
                <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-blue-400 mb-1">
                  Schedule
                </p>
                <p className="font-display text-[1.7rem] font-medium text-white leading-tight">
                  Events dates
                </p>
              </div>

              {/* Calendar widget */}
              <div className="calendar-card p-5 mb-4">
                {/* Nav */}
                <div className="flex items-center justify-between mb-5">
                  <button aria-label="Previous month"
                    className="w-8 h-8 rounded-xl flex items-center justify-center
                      bg-white/[0.07] border border-white/[0.1] text-white/50
                      hover:bg-white/[0.14] hover:text-white transition-all duration-150">
                    <ChevronLeft />
                  </button>
                  <span className="font-display text-[1.1rem] font-medium text-white tracking-wide">
                    February
                  </span>
                  <button aria-label="Next month"
                    className="w-8 h-8 rounded-xl flex items-center justify-center
                      bg-white/[0.07] border border-white/[0.1] text-white/50
                      hover:bg-white/[0.14] hover:text-white transition-all duration-150">
                    <ChevronRight />
                  </button>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 gap-0.5 mb-1">
                  {["Mo","Tu","We","Th","Fr","Sa","Su"].map((d) => (
                    <div key={d} className="text-center text-[10px] font-semibold tracking-[0.08em] uppercase text-white/30 py-1.5">
                      {d}
                    </div>
                  ))}
                </div>

                {/* Days grid */}
                <div className="grid grid-cols-7 gap-0.5">
                  {calendarDays.map((item, i) => (
                    <CalendarDay key={i} day={item.day} highlighted={item.highlighted} />
                  ))}
                </div>
              </div>

              {/* Event pills */}
              <div className="flex flex-col gap-2.5">
                {[
                  { date: "Feb 13", name: "KIZUNA KIOKO", color: "from-blue-500 to-indigo-500" },
                  { date: "Feb 24", name: "INNA",          color: "from-sky-500 to-blue-500"   },
                ].map(({ date, name, color }) => (
                  <div key={date}
                    className="flex items-center gap-3.5 px-4 py-3
                      bg-white/[0.06] border border-white/[0.1] rounded-2xl
                      hover:bg-white/[0.10] hover:border-blue-400/30
                      transition-all duration-200 group cursor-pointer">
                    <div className={`w-1.5 h-8 rounded-full bg-gradient-to-b ${color} flex-shrink-0`} />
                    <span className="font-display text-[0.9rem] font-medium text-blue-300 min-w-[52px]">{date}</span>
                    <span className="w-px h-[18px] bg-white/[0.1]" />
                    <span className="text-[13px] font-medium text-white/70 tracking-[0.03em] group-hover:text-white transition-colors">{name}</span>
                    <span className="ml-auto text-white/25 group-hover:text-blue-400 transition-colors">
                      <ArrowIcon size={13} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/30">
            <span className="text-[10px] uppercase tracking-widest">Scroll</span>
            <div className="scroll-hint w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5">
              <div className="w-1 h-2 rounded-full bg-white/40" style={{animation:"scrollBounce 2.5s ease-in-out infinite"}} />
            </div>
          </div>

          {/* Bottom wave */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-slate-50"
            style={{ clipPath: "ellipse(55% 100% at 50% 100%)" }} />
        </section>

        {/* ══════════════════════════════════════
            UPCOMING EVENTS
        ══════════════════════════════════════ */}
        <section className="events-section py-24 px-6 relative overflow-hidden">
          <div className="dot-grid" />

          <div className="relative z-10 max-w-[1200px] mx-auto">

            {/* Section header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
              <div>
                <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.16em]
                  uppercase text-blue-500 bg-blue-50 border border-blue-100 rounded-full px-3.5 py-1.5 mb-4">
                  <IconSparkle />
                  What's on
                </div>
                <h2 className="font-display font-medium text-slate-800 leading-[1.12] mb-3"
                  style={{ fontSize: "clamp(2rem,4vw,3rem)" }}>
                  Upcoming campus events
                </h2>
                <p className="text-sm text-slate-500 leading-[1.7] max-w-md">
                  Explore the latest events happening across our university community.
                </p>
              </div>

              <Link to="/events"
                className="self-start md:self-end inline-flex items-center gap-2 px-6 py-2.5
                  bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-medium
                  hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50
                  shadow-sm hover:shadow-md transition-all duration-200">
                View all <ArrowIcon size={13} />
              </Link>
            </div>

            {/* Event cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
              {upcomingEvents.map((event, idx) => (
                <Link key={event.id} to={`/event/${event.id}`}
                  className="cards-fade block event-card group"
                  style={{ animationDelay: `${idx * 0.08}s` }}>

                  {/* Image */}
                  <div className="relative overflow-hidden h-[210px]">
                    <img
                      src={event.image} alt={event.title}
                      className="w-full h-full object-cover brightness-95 saturate-95
                        group-hover:scale-[1.07] group-hover:brightness-100 group-hover:saturate-105
                        transition-all duration-500 ease-out"
                    />
                    {/* Gradient overlay on image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                    {/* Category badge */}
                    <span className="absolute top-3.5 left-3.5 text-[10px] font-bold tracking-[0.1em] uppercase
                      px-2.5 py-1 rounded-full
                      bg-white/90 text-blue-600 border border-blue-100
                      backdrop-blur-[6px] shadow-sm">
                      {event.category}
                    </span>

                    {/* Read time */}
                    <span className="absolute bottom-3 right-3 text-[10px] font-medium
                      px-2.5 py-1 rounded-full
                      bg-black/40 text-white/80 backdrop-blur-[6px]">
                      {event.readTime}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <h3 className="font-display text-[1.15rem] font-medium leading-[1.3] text-slate-800 mb-2
                      group-hover:text-blue-600 transition-colors duration-200">
                      {event.title}
                    </h3>
                    <p className="text-sm leading-[1.65] text-slate-500 mb-4 line-clamp-2"
                      style={{ display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
                      {event.description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold
                        text-blue-500 group-hover:gap-2.5 transition-all duration-200">
                        Learn more
                        <span className="card-arrow"><ArrowIcon size={12} /></span>
                      </span>
                      <span className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100
                        flex items-center justify-center text-blue-400
                        group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500
                        transition-all duration-200 shadow-sm">
                        <ArrowIcon size={12} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="text-center">
              <Link to="/events"
                className="inline-flex items-center gap-2.5 px-8 py-3.5
                  bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold
                  hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50
                  shadow-sm hover:shadow-md transition-all duration-200">
                View all events <ArrowIcon />
              </Link>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            CTA SECTION
        ══════════════════════════════════════ */}
        <section className="cta-section py-28 px-6">
          <img src={crowdBg} alt="" className="cta-img" aria-hidden="true" />
          <div className="cta-gradient" />
          <div className="hero-mesh" style={{ opacity: 0.035 }} />

          {/* Floating accent blobs */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)" }} />
          <div className="absolute bottom-0 left-10 w-[300px] h-[300px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)" }} />

          {/* Content */}
          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <div className="eyebrow-pill mx-auto w-fit mb-6">
              <div className="pulse-dot" />
              <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-blue-300">
                Get started today
              </span>
            </div>

            <h2 className="font-display font-medium text-white leading-[1.1] mb-5"
              style={{ fontSize: "clamp(2.2rem,5vw,3.8rem)" }}>
              Start managing your<br />
              <span style={{
                background: "linear-gradient(135deg, #60a5fa, #a5b4fc)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                events today
              </span>
            </h2>

            <p className="text-[0.95rem] leading-[1.75] text-white/50 max-w-md mx-auto mb-10">
              Create, track, and engage with campus events through our streamlined platform.
            </p>

            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/event-registration" className="btn-primary px-8 py-3.5 text-sm font-semibold tracking-wide">
                <div className="btn-shine" />
                <span>Register now</span>
                <span><ArrowIcon /></span>
              </Link>
              <Link to="/events" className="btn-ghost px-8 py-3.5 text-sm font-medium tracking-wide">
                Browse events
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Home;