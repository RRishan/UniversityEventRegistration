import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Plus, Eye, Edit, X, Calendar, MapPin } from "lucide-react";
import uploaded1 from "@/assets/uploaded-1.jpg";
import uploaded3 from "@/assets/uploaded-3.jpg";
import uploaded4 from "@/assets/uploaded-4.jpg";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { AppContext } from "@/context/AppContext";

/* ============================================================
 TYPES
============================================================ */

type EventStatus = "Approved" | "Pending" | "In Review" | "Rejected";

interface MyEvent {
  id: string | number;
  title: string;
  image: string;
  date: string;
  location: string;
  status: EventStatus;
  attendees?: number;
}

interface ApiEvent {
  _id: string;
  eventTitle: string;
  imageLink: string;
  eventDate: string;
  venue: string;
  isApproved: unknown; // 👈 IMPORTANT (runtime safe)
  expectedAttendees: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: T;
}

interface StatusTokens {
  pill: string;
  dot: string;
}

interface StatItem {
  label: string;
  value: number;
  accent: string;
}

/* ============================================================
 STATUS NORMALIZER (🔥 FIX)
============================================================ */

const normalizeStatus = (status: unknown): EventStatus => {
  if (typeof status === "string") {
    const s = status.toLowerCase();

    if (s.includes("approved")) return "Approved";
    if (s.includes("review")) return "In Review";
    if (s.includes("reject")) return "Rejected";
    if (s.includes("pending")) return "Pending";
  }

  if (status === true) return "Approved";
  if (status === false) return "Pending";

  return "Pending";
};

/* ============================================================
 STATUS STYLES (Theme Safe)
============================================================ */

const STATUS_CONFIG: Record<
  Lowercase<EventStatus>,
  StatusTokens
> = {
  approved: {
    pill:
      "bg-emerald-500/10 border-emerald-400/30 text-emerald-400",
    dot: "bg-emerald-400",
  },
  pending: {
    pill:
      "bg-amber-400/10 border-amber-400/30 text-amber-400",
    dot: "bg-amber-400",
  },
  "in review": {
    pill:
      "bg-sky-400/10 border-sky-400/30 text-sky-400",
    dot: "bg-sky-400",
  },
  rejected: {
    pill:
      "bg-red-400/10 border-red-400/30 text-red-400",
    dot: "bg-red-400",
  },
};

const getStatusTokens = (status: EventStatus): StatusTokens =>
  STATUS_CONFIG[status.toLowerCase() as Lowercase<EventStatus>];

/* ============================================================
 SEED DATA
============================================================ */

const SEED_EVENTS: MyEvent[] = [
  {
    id: 1,
    title: "Annual Company Retreat 2025",
    status: "In Review",
    date: "Mar 15-17, 2025",
    location: "Main Auditorium",
    image: uploaded1,
    attendees: 150,
  },
  {
    id: 2,
    title: "Tech Workshop Series",
    status: "Pending",
    date: "Feb 20, 2025",
    location: "Conference Hall A",
    image: uploaded3,
    attendees: 75,
  },
  {
    id: 3,
    title: "Cultural Night 2025",
    status: "Approved",
    date: "Apr 10, 2025",
    location: "Open Theater",
    image: uploaded4,
    attendees: 300,
  },
];

/* ============================================================
 STATS HOOK (Crash Proof)
============================================================ */

function useEventStats(events: MyEvent[]): StatItem[] {
  return [
    {
      label: "Total",
      value: events.length,
      accent: "text-white",
    },
    {
      label: "Approved",
      value: events.filter(e => e.status === "Approved").length,
      accent: "text-emerald-400",
    },
    {
      label: "Pending",
      value: events.filter(e => e.status === "Pending").length,
      accent: "text-amber-400",
    },
    {
      label: "In Review",
      value: events.filter(e => e.status === "In Review").length,
      accent: "text-sky-400",
    },
  ];
}

/* ============================================================
 UI COMPONENTS
============================================================ */

const StatCard = ({ label, value, accent }: StatItem) => (
  <div className="bg-white/5 border border-white/10 rounded-xl px-5 py-4">
    <div className={`text-2xl font-semibold ${accent}`}>
      {value}
    </div>
    <div className="text-xs uppercase text-white/40">
      {label}
    </div>
  </div>
);

const EventCard = ({ event }: { event: MyEvent }) => {
  const tokens = getStatusTokens(event.status);

  return (
    <div className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-amber-400/30 transition">
      <div className="relative h-44">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition"
        />

        <span
          className={`absolute top-3 right-3 flex items-center gap-1 text-xs px-3 py-1 rounded-full border ${tokens.pill}`}
        >
          <span className={`w-2 h-2 rounded-full ${tokens.dot}`} />
          {event.status}
        </span>
      </div>

      <div className="p-5">
        <h3 className="text-lg text-white mb-3">
          {event.title}
        </h3>

        <div className="text-sm text-white/50 space-y-1 mb-4">
          <div className="flex gap-2">
            <Calendar size={14} /> {event.date}
          </div>
          <div className="flex gap-2">
            <MapPin size={14} /> {event.location}
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/event/${event.id}`}
            className="flex-1 bg-amber-400 text-black text-xs py-2 rounded-md flex justify-center gap-1"
          >
            <Eye size={14} /> View
          </Link>

          <button className="flex-1 border border-white/20 text-white/60 text-xs py-2 rounded-md flex justify-center gap-1">
            <Edit size={14} /> Edit
          </button>

          <button className="px-3 border border-red-400/30 text-red-400 rounded-md">
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
 PAGE
============================================================ */

type FilterValue = "all" | "approved" | "pending" | "in review" | "rejected";

const FILTERS: FilterValue[] = [
  "all",
  "approved",
  "pending",
  "in review",
  "rejected",
];

const MyEvents: React.FC = () => {
  const [filter, setFilter] = useState<FilterValue>("all");
  const [myEvents, setMyEvents] =
    useState<MyEvent[]>(SEED_EVENTS);

  const { backendUrl } = useContext(AppContext);
  const stats = useEventStats(myEvents);

  const getAllEvents = async () => {
    try {
      const { data } =
        await axios.get<ApiResponse<ApiEvent[]>>(
          `${backendUrl}/api/event/organization-events`,
          { withCredentials: true }
        );

      if (!data.success) return;

      const formatted = data.message.map(event => ({
        id: event._id,
        title: event.eventTitle,
        image: event.imageLink,
        date: event.eventDate,
        location: event.venue,
        status: normalizeStatus(event.isApproved),
        attendees: event.expectedAttendees,
      }));

      setMyEvents(formatted);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message ?? error.message);
    }
  };

  useEffect(() => {
    getAllEvents();
  }, []);

  const filteredEvents = myEvents.filter(event =>
    filter === "all"
      ? true
      : event.status.toLowerCase() === filter
  );

  return (
    <MainLayout
      title="My Events"
      subtitle="Manage your event submissions"
    >
      <div className="max-w-6xl mx-auto px-5 pb-16">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {stats.map(stat => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-md text-xs capitalize ${
                filter === f
                  ? "bg-amber-400 text-black"
                  : "bg-white/5 text-white/60"
              }`}
            >
              {f}
            </button>
          ))}

          <Link
            to="/event-registration"
            className="ml-auto bg-amber-400 text-black px-4 py-2 rounded-md flex gap-2 text-xs"
          >
            <Plus size={14} /> Create Event
          </Link>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default MyEvents;