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
   NOTE: This component uses a small set of custom utilities
   that must be added to your tailwind.config.js / globals.css:

   In tailwind.config.js → theme.extend:
   ┌─────────────────────────────────────────────────────────┐
   │ fontFamily: {                                           │
   │   display: ['Cormorant Garamond', 'serif'],            │
   │   body:    ['DM Sans', 'sans-serif'],                  │
   │ },                                                      │
   │ colors: {                                               │
   │   brand: {                                              │
   │     amber: '#ffbe3c',                                   │
   │     dark:  '#0a0a0b',                                   │
   │     card:  '#111113',                                   │
   │   }                                                     │
   │ }                                                       │
   └─────────────────────────────────────────────────────────┘

   In globals.css add the Google Fonts import:
   @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=DM+Sans:wght@300;400;500&display=swap');

   And these small keyframe + utility classes in @layer utilities:
   .scanlines {
     background-image: repeating-linear-gradient(
       0deg, transparent, transparent 2px,
       rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px
     );
   }
   .line-clamp-2 {
     display: -webkit-box;
     -webkit-line-clamp: 2;
     -webkit-box-orient: vertical;
     overflow: hidden;
   }
   @keyframes pulse-dot {
     0%,100% { opacity:1; transform:scale(1); }
     50%      { opacity:0.5; transform:scale(0.7); }
   }
   .animate-pulse-dot { animation: pulse-dot 2s ease infinite; }
───────────────────────────────────────────────────────────── */

/* ── Calendar static data (unchanged) ─────────────────────── */
const calendarEvents: Record<
  string,
  { title: string; time: string; location: string }
> = {
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

/* ── Shared icon snippets ────────────────────────────────── */
const ArrowIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6"/>
  </svg>
);
const ClockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
  </svg>
);
const PinIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);
const ChevronLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 19l-7-7 7-7"/>
  </svg>
);
const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 5l7 7-7 7"/>
  </svg>
);

/* ── CalendarDay ─────────────────────────────────────────── */
const CalendarDay = ({ day, highlighted }: { day: string; highlighted: boolean }) => {
  if (!day) return <div className="text-center py-2 text-sm" />;

  if (highlighted && calendarEvents[day]) {
    const event = calendarEvents[day];
    return (
      <HoverCard openDelay={100} closeDelay={100}>
        <HoverCardTrigger asChild>
          <div className="
            text-center text-sm py-2 rounded-lg cursor-pointer font-semibold
            bg-[rgba(255,190,60,0.18)] text-[#ffbe3c]
            border border-[rgba(255,190,60,0.3)]
            shadow-[0_0_10px_rgba(255,190,60,0.12)]
            hover:bg-[rgba(255,190,60,0.28)]
            transition-colors duration-150
          ">
            {day}
          </div>
        </HoverCardTrigger>

        <HoverCardContent
          side="top"
          align="center"
          className="
            w-56 p-4
            bg-[#111113]
            border border-white/10
            rounded-2xl
            shadow-[0_20px_60px_rgba(0,0,0,0.6)]
            font-body text-[#f0ede8]
          "
        >
          {/* Date label */}
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#ffbe3c] shrink-0" />
            <span className="text-[10px] tracking-widest uppercase text-white/35">
              Feb {day}
            </span>
          </div>

          {/* Title */}
          <p className="font-display text-lg font-light text-[#f0ede8] mt-1 mb-2">
            {event.title}
          </p>

          {/* Meta */}
          <div className="flex flex-col gap-1.5 mb-3">
            <div className="flex items-center gap-2 text-[11px] text-white/40">
              <ClockIcon /> {event.time}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-white/40">
              <PinIcon /> {event.location}
            </div>
          </div>

          {/* CTA */}
          <Link
            to={`/event/${day}`}
            className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#ffbe3c] hover:opacity-75 transition-opacity"
          >
            View details <ArrowIcon size={11} />
          </Link>
        </HoverCardContent>
      </HoverCard>
    );
  }

  return (
    <div className="
      text-center text-sm py-2 rounded-lg
      text-white/45 cursor-pointer
      hover:bg-white/[0.07] hover:text-[#f0ede8]
      transition-colors duration-150
    ">
      {day}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════ */
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
    <div className="min-h-screen flex flex-col bg-[#0a0a0b] font-body text-[#f0ede8]">
      <Header />

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className="relative overflow-hidden min-h-[92vh] flex flex-col justify-center group">

        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-[center_30%] brightness-[0.28] saturate-110 scale-[1.04] group-hover:scale-100 transition-transform duration-[16000ms] ease-linear"
          style={{ backgroundImage: `url(${crowdBg})` }}
        />

        {/* Gradient vignettes */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              linear-gradient(to bottom, rgba(10,10,11,0.5) 0%, transparent 35%),
              linear-gradient(to top,    rgba(10,10,11,0.85) 0%, transparent 50%),
              linear-gradient(to right,  rgba(10,10,11,0.4) 0%, transparent 60%)
            `
          }}
        />

        {/* Scanlines */}
        <div className="absolute inset-0 scanlines pointer-events-none z-[1]" />

        {/* Content grid */}
        <div className="relative z-[2] max-w-[1160px] mx-auto w-full px-6 py-24
          grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Left col ── */}
          <div>
            {/* Eyebrow pill */}
            <div className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.14em] uppercase
              text-[#ffbe3c] bg-[rgba(255,190,60,0.1)] border border-[rgba(255,190,60,0.2)]
              rounded-full px-3.5 py-1.5 mb-6">
              <span className="w-[5px] h-[5px] rounded-full bg-[#ffbe3c] animate-pulse-dot" />
              University Events Platform
            </div>

            {/* Title */}
            <h1 className="font-display font-light text-[clamp(2.8rem,6vw,5rem)] leading-[1.05] text-[#f0ede8] mb-5">
              Discover &amp; manage<br />
              <em className="italic text-[#ffbe3c]">campus events</em>
            </h1>

            {/* Body */}
            <p className="text-[0.92rem] leading-[1.75] text-white/50 max-w-md mb-9">
              Streamline event registration and approval for students, organizers,
              and faculty. Find, create, and track events with ease.
            </p>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <Link to="/events"
                className="inline-flex items-center gap-2 px-7 py-3
                  bg-gradient-to-br from-[#ffbe3c] to-[#ff8c00] text-[#0a0a0b]
                  text-[13px] font-medium tracking-[0.08em] uppercase
                  rounded-[10px] border-none cursor-pointer
                  shadow-[0_4px_24px_rgba(255,190,60,0.3)]
                  hover:opacity-90 hover:-translate-y-px hover:shadow-[0_6px_32px_rgba(255,190,60,0.45)]
                  transition-all duration-200"
              >
                Browse events <ArrowIcon />
              </Link>

              {!isLoggedIn && (
                <Link to="/event-registration"
                  className="inline-flex items-center gap-2 px-7 py-3
                    bg-transparent text-white/70
                    text-[13px] font-normal tracking-[0.08em] uppercase
                    border border-white/[0.14] rounded-[10px] cursor-pointer
                    hover:border-white/30 hover:text-[#f0ede8] hover:bg-white/[0.05]
                    transition-all duration-200"
                >
                  Register
                </Link>
              )}
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-11 pt-8 border-t border-white/[0.07]">
              {[
                { val: "200+", label: "Events / year" },
                { val: "5k+",  label: "Attendees"     },
                { val: "40+",  label: "Organizers"    },
              ].map(({ val, label }) => (
                <div key={label}>
                  <div className="font-display text-[1.9rem] font-normal text-[#f0ede8] leading-none mb-1">
                    {val}
                  </div>
                  <div className="text-[11px] tracking-[0.1em] uppercase text-white/30">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right col: Calendar ── */}
          <div>
            {/* Label + title */}
            <div className="mb-5">
              <div className="text-[11px] font-medium tracking-[0.14em] uppercase text-white/35 mb-1.5">
                Schedule
              </div>
              <div className="font-display text-[1.6rem] font-light text-[#f0ede8]">
                Events dates
              </div>
            </div>

            {/* Calendar widget */}
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-[18px] p-5 mb-4">

              {/* Nav */}
              <div className="flex items-center justify-between mb-5">
                <button
                  aria-label="Previous month"
                  className="w-[30px] h-[30px] rounded-lg flex items-center justify-center
                    bg-white/[0.05] border border-white/[0.07] text-white/40
                    hover:bg-white/[0.09] hover:text-[#f0ede8] transition-colors duration-150"
                >
                  <ChevronLeft />
                </button>
                <span className="font-display text-[1.1rem] font-normal text-[#f0ede8] tracking-[0.04em]">
                  February
                </span>
                <button
                  aria-label="Next month"
                  className="w-[30px] h-[30px] rounded-lg flex items-center justify-center
                    bg-white/[0.05] border border-white/[0.07] text-white/40
                    hover:bg-white/[0.09] hover:text-[#f0ede8] transition-colors duration-150"
                >
                  <ChevronRight />
                </button>
              </div>

              {/* Day-of-week headers */}
              <div className="grid grid-cols-7 gap-0.5 mb-1">
                {["Mo","Tu","We","Th","Fr","Sa","Su"].map((d) => (
                  <div key={d}
                    className="text-center text-[10px] font-medium tracking-[0.08em] uppercase text-white/25 py-1.5">
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
            <div className="flex flex-col gap-2">
              {[
                { date: "Feb 13", name: "KIZUNA KIOKO" },
                { date: "Feb 20", name: "INNA" },
              ].map(({ date, name }) => (
                <div key={date}
                  className="flex items-center gap-3.5 px-4 py-2.5
                    bg-white/[0.03] border border-white/[0.06] rounded-[10px]
                    hover:bg-white/[0.05] hover:border-[rgba(255,190,60,0.2)]
                    transition-colors duration-150"
                >
                  <span className="font-display text-[0.95rem] font-normal text-[#ffbe3c] min-w-[52px]">
                    {date}
                  </span>
                  <span className="w-px h-[18px] bg-white/[0.08]" />
                  <span className="text-[13px] font-medium text-white/70 tracking-[0.04em]">
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          UPCOMING EVENTS
      ══════════════════════════════════════ */}
      <section className="bg-[#0d0d0f] py-24 px-6 border-t border-white/[0.04]">
        <div className="max-w-[1160px] mx-auto">

          {/* Section header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <span className="block text-[11px] font-medium tracking-[0.14em] uppercase text-[#ffbe3c] mb-2.5">
                What's on
              </span>
              <h2 className="font-display font-light text-[clamp(2rem,4vw,3rem)] leading-[1.1] text-[#f0ede8] mb-2">
                Upcoming campus events
              </h2>
              <p className="text-[13px] text-white/35 leading-[1.7] max-w-md">
                Explore the latest events happening across our university community.
              </p>
            </div>
            <Link to="/events"
              className="self-start md:self-end inline-flex items-center gap-2 px-6 py-2.5
                bg-transparent text-white/55
                text-[12px] font-normal tracking-[0.1em] uppercase
                border border-white/10 rounded-[10px]
                hover:border-white/24 hover:text-[#f0ede8] hover:bg-white/[0.04]
                transition-all duration-200"
            >
              View all <ArrowIcon size={13} />
            </Link>
          </div>

          {/* Event cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {upcomingEvents.map((event) => (
              <Link key={event.id} to={`/event/${event.id}`}
                className="group block
                  bg-white/[0.025] border border-white/[0.07] rounded-[18px] overflow-hidden
                  hover:border-[rgba(255,190,60,0.25)] hover:-translate-y-[3px]
                  hover:shadow-[0_16px_50px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,190,60,0.08)]
                  transition-all duration-[220ms]"
              >
                {/* Image */}
                <div className="relative overflow-hidden h-[200px]">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover brightness-[0.85] saturate-95
                      group-hover:scale-[1.06] group-hover:brightness-95 group-hover:saturate-105
                      transition-all duration-500 ease-out"
                  />
                  {/* Category badge */}
                  <span className="absolute top-3.5 left-3.5
                    text-[10px] font-medium tracking-[0.08em] uppercase
                    px-2.5 py-1 rounded-full
                    bg-[rgba(10,10,11,0.75)] border border-[rgba(255,190,60,0.3)] text-[#ffbe3c]
                    backdrop-blur-[6px]">
                    {event.category}
                  </span>
                </div>

                {/* Body */}
                <div className="p-5 pb-6">
                  <p className="text-[11px] text-white/28 tracking-[0.04em] mb-2.5">
                    {event.readTime}
                  </p>
                  <h3 className="font-display text-[1.2rem] font-normal leading-[1.3] text-[#f0ede8] mb-2.5
                    group-hover:text-[#ffbe3c] transition-colors duration-150">
                    {event.title}
                  </h3>
                  <p className="text-[12.5px] leading-[1.65] text-white/35 mb-4 line-clamp-2">
                    {event.description}
                  </p>
                  <span className="inline-flex items-center gap-1.5
                    text-[12px] font-medium tracking-[0.06em] uppercase text-white/35
                    group-hover:text-[#ffbe3c] group-hover:gap-2.5
                    transition-all duration-150">
                    Learn more <ArrowIcon size={13} />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Footer CTA */}
          <div className="text-center">
            <Link to="/events"
              className="inline-flex items-center gap-2 px-8 py-3
                bg-transparent text-white/55
                text-[12px] font-normal tracking-[0.1em] uppercase
                border border-white/10 rounded-[10px]
                hover:border-white/24 hover:text-[#f0ede8] hover:bg-white/[0.04]
                transition-all duration-200"
            >
              View all events <ArrowIcon size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA SECTION
      ══════════════════════════════════════ */}
      <section className="relative overflow-hidden py-28 px-6">

        {/* BG image */}
        <div
          className="absolute inset-0 bg-cover bg-[center_40%] brightness-[0.2] saturate-80 scale-[1.04]"
          style={{ backgroundImage: `url(${crowdBg})` }}
        />

        {/* Overlays */}
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, rgba(10,10,11,0.75) 0%, rgba(10,10,11,0.45) 100%)" }}
        />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(115deg, transparent 35%, rgba(255,190,60,0.04) 50%, transparent 65%)" }}
        />
        <div className="absolute inset-0 scanlines pointer-events-none" />

        {/* Content */}
        <div className="relative z-[1] max-w-xl mx-auto text-center">
          <span className="inline-block text-[11px] font-medium tracking-[0.14em] uppercase text-[#ffbe3c] mb-5">
            Get started today
          </span>
          <h2 className="font-display font-light text-[clamp(2.2rem,5vw,3.8rem)] leading-[1.1] text-[#f0ede8] mb-4">
            Start managing your<br />
            <em className="italic text-[#ffbe3c]">events today</em>
          </h2>
          <p className="text-[14px] leading-[1.75] text-white/45 max-w-md mx-auto mb-10">
            Create, track, and engage with campus events through our streamlined platform.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/event-registration"
              className="inline-flex items-center gap-2 px-7 py-3
                bg-gradient-to-br from-[#ffbe3c] to-[#ff8c00] text-[#0a0a0b]
                text-[13px] font-medium tracking-[0.08em] uppercase
                rounded-[10px] border-none cursor-pointer
                shadow-[0_4px_24px_rgba(255,190,60,0.3)]
                hover:opacity-90 hover:-translate-y-px hover:shadow-[0_6px_32px_rgba(255,190,60,0.45)]
                transition-all duration-200"
            >
              Register now <ArrowIcon />
            </Link>
            <Link to="/events"
              className="inline-flex items-center gap-2 px-7 py-3
                bg-transparent text-white/70
                text-[13px] font-normal tracking-[0.08em] uppercase
                border border-white/[0.14] rounded-[10px]
                hover:border-white/30 hover:text-[#f0ede8] hover:bg-white/[0.05]
                transition-all duration-200"
            >
              Learn more
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;