import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import axios from "axios";
import { AppContext } from "@/context/AppContext";
import { toast } from "@/components/ui/sonner";

/* ── Shared icon atoms ───────────────────────────────────── */
const IconSearch = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);
const IconChevron = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9l6 6 6-6"/>
  </svg>
);
const IconCalendar = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <path d="M16 2v4M8 2v4M3 10h18"/>
  </svg>
);
const IconPin = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);
const IconArrow = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6"/>
  </svg>
);
const IconFilter = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>
  </svg>
);

/* ── Status badge helper (unchanged logic) ───────────────── */
const getStatusBadge = (status: string) => {
  const map: Record<string, string> = {
    approved: "bg-[rgba(74,222,128,0.1)] border-[rgba(74,222,128,0.25)] text-[#4ade80]",
    pending:  "bg-[rgba(255,190,60,0.1)]  border-[rgba(255,190,60,0.25)]  text-[#ffbe3c]",
    rejected: "bg-[rgba(255,107,107,0.1)] border-[rgba(255,107,107,0.25)] text-[#ff6b6b]",
  };
  return map[status.toLowerCase()] ?? map.pending;
};

/* ── Shared select wrapper (dark-themed) ─────────────────── */
const FilterSelect = ({
  value,
  onChange,
  children,
  icon,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
  icon: React.ReactNode;
}) => (
  <div className="relative flex items-center">
    <span className="absolute left-3.5 text-white/30 pointer-events-none">{icon}</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="
        appearance-none pl-9 pr-9 py-2.5
        bg-white/[0.04] border border-white/[0.09] rounded-[10px]
        text-[13px] font-body text-white/60
        focus:outline-none focus:border-[rgba(255,190,60,0.45)]
        focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(255,190,60,0.07)]
        hover:border-white/[0.16] hover:text-white/80
        transition-all duration-200 cursor-pointer
        [&>option]:bg-[#111113] [&>option]:text-[#f0ede8]
      "
    >
      {children}
    </select>
    <span className="absolute right-3 text-white/25 pointer-events-none"><IconChevron /></span>
  </div>
);

/* ══════════════════════════════════════════════════════════ */
const Events = () => {
  const [searchQuery,      setSearchQuery]      = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDate,     setSelectedDate]     = useState("");
  const [allEvents,        setAllEvents]        = useState<any[]>([]);

  const { backendUrl } = useContext(AppContext);

  /* ── Filtering logic (unchanged) ── */
  const filteredEvents = allEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory ||
      event.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  /* ── Data fetching (unchanged) ── */
  const getAllEvents = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.get(backendUrl + "/api/event/events");
      if (data.success) {
        const formattedEvents = data.message.map((event: any) => ({
          id:       event._id,
          title:    event.eventTitle,
          image:    event.imageLink,
          date:     event.eventDate,
          location: event.venue,
          category: event.category.charAt(0).toUpperCase() + event.category.slice(1),
          status:   "Approved",
        }));
        setAllEvents(formattedEvents);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => { getAllEvents(); }, []);

  const hasResults = filteredEvents.length > 0;
  const activeFilters = [searchQuery, selectedCategory, selectedDate].filter(Boolean).length;

  return (
    <MainLayout title="Upcoming Events" subtitle="Discover and explore university events">
      <div className="max-w-[1160px] mx-auto px-5 pb-16">

        {/* ── Filter bar ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10">

          {/* Search input */}
          <div className="relative flex-1 min-w-[200px]">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none">
              <IconSearch />
            </span>
            <input
              type="text"
              placeholder="Search events or venues…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="
                w-full pl-10 pr-4 py-2.5
                bg-white/[0.04] border border-white/[0.09] rounded-[10px]
                text-[13px] font-body text-[#f0ede8] placeholder-white/25
                focus:outline-none focus:border-[rgba(255,190,60,0.45)]
                focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(255,190,60,0.07)]
                hover:border-white/[0.16]
                transition-all duration-200
              "
            />
          </div>

          {/* Selects row */}
          <div className="flex gap-3 flex-wrap sm:flex-nowrap">
            <FilterSelect
              value={selectedCategory}
              onChange={setSelectedCategory}
              icon={<IconFilter />}
            >
              <option value="">All Categories</option>
              <option value="concert">Concert</option>
              <option value="festival">Festival</option>
              <option value="performance">Performance</option>
              <option value="workshop">Workshop</option>
            </FilterSelect>

            <FilterSelect
              value={selectedDate}
              onChange={setSelectedDate}
              icon={<IconCalendar />}
            >
              <option value="">All Dates</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </FilterSelect>
          </div>
        </div>

        {/* ── Results count + active filter pill ── */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-[12px] text-white/30 tracking-[0.04em]">
            {hasResults
              ? <><span className="text-white/55 font-medium">{filteredEvents.length}</span> event{filteredEvents.length !== 1 ? "s" : ""} found</>
              : "No events match your filters"
            }
          </p>
          {activeFilters > 0 && (
            <button
              onClick={() => { setSearchQuery(""); setSelectedCategory(""); setSelectedDate(""); }}
              className="text-[11px] font-medium text-[#ffbe3c] hover:opacity-75 transition-opacity duration-150 tracking-[0.04em]"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* ── Events grid ── */}
        {hasResults ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="
                  group relative
                  bg-white/[0.025] border border-white/[0.07] rounded-[18px] overflow-hidden
                  hover:border-[rgba(255,190,60,0.25)] hover:-translate-y-[3px]
                  hover:shadow-[0_16px_50px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,190,60,0.08)]
                  transition-all duration-[220ms]
                "
              >
                {/* Image */}
                <div className="relative h-[190px] overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover brightness-[0.82] saturate-95
                      group-hover:scale-[1.06] group-hover:brightness-90
                      transition-all duration-500 ease-out"
                  />
                  {/* Gradient fade into card body */}
                  <div className="absolute inset-x-0 bottom-0 h-16
                    bg-gradient-to-t from-[rgba(10,10,11,0.7)] to-transparent pointer-events-none" />

                  {/* Category badge */}
                  <span className="absolute top-3 left-3
                    text-[10px] font-medium tracking-[0.08em] uppercase
                    px-2.5 py-1 rounded-full
                    bg-[rgba(10,10,11,0.75)] border border-[rgba(255,190,60,0.3)] text-[#ffbe3c]
                    backdrop-blur-[6px]">
                    {event.category}
                  </span>

                  {/* Status badge */}
                  <span className={`absolute top-3 right-3
                    text-[10px] font-medium tracking-[0.06em] capitalize
                    px-2.5 py-1 rounded-full border backdrop-blur-[6px]
                    ${getStatusBadge(event.status)}`}>
                    {event.status}
                  </span>
                </div>

                {/* Card body */}
                <div className="p-5">
                  <h3 className="font-display text-[1.15rem] font-normal leading-[1.25]
                    text-[#f0ede8] mb-3 group-hover:text-[#ffbe3c] transition-colors duration-150">
                    {event.title}
                  </h3>

                  {/* Meta */}
                  <div className="flex flex-col gap-1.5 mb-5">
                    <div className="flex items-center gap-2 text-[12px] text-white/38">
                      <span className="text-white/25"><IconCalendar /></span>
                      {event.date}
                    </div>
                    <div className="flex items-center gap-2 text-[12px] text-white/38">
                      <span className="text-white/25"><IconPin /></span>
                      {event.location}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2.5">
                    <Link
                      to={`/event/${event.id}`}
                      className="
                        flex-1 inline-flex items-center justify-center gap-1.5
                        py-2 px-3
                        bg-gradient-to-br from-[#ffbe3c] to-[#ff8c00] text-[#0a0a0b]
                        text-[11.5px] font-medium tracking-[0.06em] uppercase
                        rounded-[8px] border-none cursor-pointer
                        shadow-[0_3px_14px_rgba(255,190,60,0.22)]
                        hover:opacity-90 hover:shadow-[0_4px_20px_rgba(255,190,60,0.36)]
                        transition-all duration-150
                      "
                    >
                      View details <IconArrow />
                    </Link>
                    <button
                      className="
                        flex-1 py-2 px-3
                        bg-transparent text-white/50
                        text-[11.5px] font-normal tracking-[0.06em] uppercase
                        border border-white/[0.1] rounded-[8px] cursor-pointer
                        hover:border-[rgba(255,190,60,0.3)] hover:text-[#ffbe3c]
                        hover:bg-[rgba(255,190,60,0.05)]
                        transition-all duration-150
                      "
                    >
                      Register
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ── Empty state ── */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 rounded-[14px]
              bg-[rgba(255,190,60,0.08)] border border-[rgba(255,190,60,0.15)]
              flex items-center justify-center text-[#ffbe3c] mb-5">
              <IconSearch />
            </div>
            <p className="font-display text-[1.4rem] font-light text-[#f0ede8] mb-2">
              No events found
            </p>
            <p className="text-[13px] text-white/35 max-w-xs leading-relaxed">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <button
              onClick={() => { setSearchQuery(""); setSelectedCategory(""); setSelectedDate(""); }}
              className="mt-6 text-[12px] font-medium text-[#ffbe3c] hover:opacity-75 transition-opacity"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* ── Load more ── */}
        {hasResults && (
          <div className="text-center">
            <button className="
              inline-flex items-center gap-2 px-8 py-3
              bg-transparent text-white/50
              text-[12px] font-normal tracking-[0.1em] uppercase
              border border-white/[0.1] rounded-[10px]
              hover:border-white/[0.22] hover:text-[#f0ede8] hover:bg-white/[0.04]
              transition-all duration-200
            ">
              Load more events
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12l7 7 7-7"/>
              </svg>
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Events;