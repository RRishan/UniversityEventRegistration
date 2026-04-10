import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search, Calendar, Eye, MessageCircle, X, Check,
  AlertTriangle, Clock, Download, FileText,
  ChevronLeft, ChevronRight, Settings, LogOut,
} from "lucide-react";
import crowdBg from "@/assets/crowd-bg.jpg";
import axios from "axios";
import { AppContext } from "@/context/AppContext";
import { toast } from "sonner";

/* ─────────────────────────────────────────
   STATUS CONFIG
───────────────────────────────────────── */
const STATUS_MAP: Record<string, { pill: string; dot: string; label: string }> = {
  Pending:    { pill: "bg-amber-50  border-amber-200  text-amber-700",    dot: "bg-amber-500",   label: "Pending"    },
  Approved:   { pill: "bg-emerald-50 border-emerald-200 text-emerald-700", dot: "bg-emerald-500", label: "Approved"   },
  Overdue:    { pill: "bg-red-50    border-red-200    text-red-700",      dot: "bg-red-500",     label: "Overdue"    },
  "In Review":{ pill: "bg-blue-50   border-blue-200   text-blue-700",     dot: "bg-blue-500",    label: "In Review"  },
};

const StatusBadge = ({ status }: { status: string }) => {
  const cfg = STATUS_MAP[status] ?? STATUS_MAP.Pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${cfg.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

/* ─────────────────────────────────────────
   AVATAR
───────────────────────────────────────── */
const Avatar = ({ name, size = "sm" }: { name: string; size?: "sm" | "md" | "lg" }) => {
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const grads = ["from-blue-400 to-indigo-500", "from-emerald-400 to-teal-500", "from-violet-400 to-purple-500", "from-amber-400 to-orange-500"];
  const grad = grads[name.charCodeAt(0) % grads.length];
  const sz = size === "lg" ? "w-12 h-12 text-sm" : size === "md" ? "w-9 h-9 text-xs" : "w-7 h-7 text-[10px]";
  return (
    <div className={`${sz} rounded-full bg-gradient-to-br ${grad} flex items-center justify-center text-white font-bold flex-shrink-0`}>
      {initials}
    </div>
  );
};

/* ─────────────────────────────────────────
   SIDEBAR NAV ITEM
───────────────────────────────────────── */
const SideNavItem = ({
  icon, label, count, active = false, danger = false, onClick,
}: {
  icon: React.ReactNode; label: string; count?: number; active?: boolean; danger?: boolean; onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
      ${active
        ? "bg-blue-50 border border-blue-100 text-blue-700 shadow-sm"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
      }`}>
    <span className={active ? "text-blue-500" : "text-slate-400"}>{icon}</span>
    <span className="flex-1 text-left">{label}</span>
    {count !== undefined && (
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
        danger ? "bg-red-100 text-red-600 border border-red-200" :
        active  ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"
      }`}>
        {count}
      </span>
    )}
  </button>
);

/* ═══════════════════════════════════════════════════════ */
const ApprovalDashboard = () => {
  const [searchQuery,    setSearchQuery]    = useState("");
  const [statusFilter,   setStatusFilter]   = useState("all");
  const [selectedEvent,  setSelectedEvent]  = useState<typeof events[0] | null>(null);
  const [comment,        setComment]        = useState("");
  const [activeNav,      setActiveNav]      = useState("pending");
  const navigate = useNavigate();

  const events = [
    { id:1, title:"Annual Research Symposium 2025",  organizer:"Dr. Nayana",           submissionDate:"Dec 28, 2024", status:"Overdue",   dueDate:"Jan 15, 2025", eventDate:"March 15-17, 2025", location:"University Conference Center", expectedAttendees:250,
      description:"Annual symposium showcasing faculty and graduate student research across all departments. Features keynote speakers, poster sessions, and networking opportunities.",
      documents:["Event_Proposal.pdf"],
      comments:[
        { author:"Dr. Sarah Mitchell", role:"Dean of Faculty",   time:"2 days ago",   text:"Please provide more details on the catering arrangements and accessibility accommodations." },
        { author:"Dr. James Wilson",   role:"",                  time:"1 day ago",    text:"Updated documentation has been attached with the requested information." },
        { author:"Prof. Michael Torres",role:"",                 time:"5 hours ago",  text:"Budget seems reasonable for this scale of event." },
      ],
    },
    { id:2, title:"Spring Career Fair 2025",         organizer:"Prof. Emily Chen",      submissionDate:"Jan 02, 2025", status:"Pending",   eventDate:"April 5, 2025",    location:"Main Hall",                    expectedAttendees:500, description:"Annual career fair connecting students with employers.",               documents:[], comments:[] },
    { id:3, title:"Guest Lecture Series: AI Ethics", organizer:"Dr. Michael Brown",     submissionDate:"Jan 03, 2025", status:"Pending",   eventDate:"Feb 20, 2025",     location:"Lecture Hall B",               expectedAttendees:150, description:"Guest lecture on ethical considerations in AI development.",          documents:[], comments:[] },
    { id:4, title:"Student Innovation Workshop",     organizer:"Lisa Anderson",          submissionDate:"Dec 20, 2024", status:"Overdue",   dueDate:"Jan 10, 2025", eventDate:"March 1, 2025",    location:"Innovation Lab",               expectedAttendees:75,  description:"Workshop on innovation and entrepreneurship for students.",           documents:[], comments:[] },
    { id:5, title:"Department Fundraiser Gala",      organizer:"Prof. Robert Martinez",  submissionDate:"Jan 04, 2025", status:"Pending",   eventDate:"May 10, 2025",     location:"Grand Ballroom",               expectedAttendees:300, description:"Annual fundraising gala for department scholarships.",               documents:[], comments:[] },
    { id:6, title:"Graduate Student Orientation",    organizer:"Dr. Amanda Lee",         submissionDate:"Jan 05, 2025", status:"In Review", eventDate:"Aug 25, 2025",     location:"Student Center",               expectedAttendees:200, description:"Orientation program for new graduate students.",                     documents:[], comments:[] },
  ];

  const statusCounts = { pending:8, inReview:3, completed:0, overdue:2 };

  const { backendUrl, setIsLoggedIn } = useContext(AppContext);

  const handleLogout = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const { data } = await axios.post(backendUrl + "/api/auth/logout");
      if (data.success) {
        toast.success("Logout successful!");
        setIsLoggedIn(false);
        navigate("/sign-in");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  const filteredEvents = events.filter(e => {
    const matchSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        e.organizer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "all" || e.status.toLowerCase().replace(" ", "-") === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');
        .font-display { font-family:'Playfair Display',Georgia,serif; }
        .font-body    { font-family:'DM Sans',system-ui,sans-serif; }

        .dash-root { font-family:'DM Sans',system-ui,sans-serif; background:#f8fafc; }

        /* Sidebar */
        .sidebar {
          background:rgba(255,255,255,0.94);
          border-right:1px solid rgba(226,232,240,0.8);
          box-shadow:2px 0 16px rgba(59,130,246,0.05);
        }

        /* Header */
        .dash-header {
          background:rgba(255,255,255,0.95);
          backdrop-filter:blur(16px);
          border-bottom:1px solid rgba(226,232,240,0.8);
          box-shadow:0 2px 8px rgba(59,130,246,0.04);
        }

        /* Filter bar */
        .filter-bar {
          background:rgba(255,255,255,0.90);
          backdrop-filter:blur(12px);
          border-bottom:1px solid rgba(226,232,240,0.7);
        }

        /* Table */
        .events-table { background:white; border:1px solid rgba(226,232,240,0.8); border-radius:16px; overflow:hidden; box-shadow:0 2px 8px rgba(59,130,246,0.04); }
        .table-row { transition:background 0.15s, box-shadow 0.15s; border-bottom:1px solid #f1f5f9; }
        .table-row:hover { background:#f8faff; box-shadow:inset 3px 0 0 #3b82f6; }
        .table-row.selected { background:#eff6ff; box-shadow:inset 3px 0 0 #3b82f6; }
        .table-row:last-child { border-bottom:none; }

        /* Search input */
        .search-input { background:white; border:1.5px solid #e2e8f0; border-radius:12px; transition:all 0.22s; font-family:'DM Sans',system-ui,sans-serif; }
        .search-input:focus { border-color:#3b82f6; box-shadow:0 0 0 4px rgba(59,130,246,0.10); outline:none; }
        .search-input::placeholder { color:#94a3b8; }

        /* Filter select */
        .filter-select { background:white; border:1.5px solid #e2e8f0; border-radius:12px; font-family:'DM Sans',system-ui,sans-serif; transition:all 0.22s; }
        .filter-select:focus { border-color:#3b82f6; box-shadow:0 0 0 4px rgba(59,130,246,0.10); outline:none; }

        /* Action icon btn */
        .action-icon { width:30px; height:30px; border-radius:8px; display:flex; align-items:center; justify-content:center; transition:all 0.18s; border:1.5px solid transparent; }
        .action-icon:hover { transform:translateY(-1px); }
        .action-icon-view    { color:#64748b; } .action-icon-view:hover    { background:#eff6ff; border-color:#bfdbfe; color:#2563eb; }
        .action-icon-comment { color:#64748b; } .action-icon-comment:hover { background:#f0fdf4; border-color:#bbf7d0; color:#059669; }
        .action-icon-check   { color:#059669; } .action-icon-check:hover   { background:#f0fdf4; border-color:#bbf7d0; color:#059669; }
        .action-icon-x       { color:#ef4444; } .action-icon-x:hover       { background:#fef2f2; border-color:#fecaca; color:#dc2626; }

        /* Detail panel */
        .detail-panel { background:white; border:1px solid rgba(226,232,240,0.8); border-radius:20px; box-shadow:0 4px 32px rgba(59,130,246,0.10); animation:panelSlide 0.3s cubic-bezier(0.4,0,0.2,1) both; overflow:hidden; }
        @keyframes panelSlide { from{opacity:0;transform:translateX(16px)} to{opacity:1;transform:translateX(0)} }

        /* Event info card inside panel */
        .event-info-card { background:linear-gradient(135deg,#eff6ff,#f0f9ff); border:1.5px solid #bfdbfe; border-radius:16px; }

        /* Comment card */
        .comment-item { background:#f8fafc; border:1px solid #f1f5f9; border-radius:12px; transition:border-color 0.18s; }
        .comment-item:hover { border-color:#bfdbfe; }

        /* Approve / Reject buttons */
        .btn-approve { background:linear-gradient(135deg,#059669,#10b981); box-shadow:0 4px 12px rgba(16,185,129,0.28); transition:all 0.22s; position:relative; overflow:hidden; }
        .btn-approve:hover { transform:translateY(-2px); box-shadow:0 8px 20px rgba(16,185,129,0.38); }
        .btn-reject  { background:white; border:1.5px solid #fecaca; color:#dc2626; transition:all 0.22s; }
        .btn-reject:hover  { background:#fef2f2; border-color:#fca5a5; transform:translateY(-1px); }
        .btn-revision { background:white; border:1.5px solid #bfdbfe; color:#2563eb; transition:all 0.22s; }
        .btn-revision:hover { background:#eff6ff; border-color:#93c5fd; transform:translateY(-1px); }

        /* Comment send btn */
        .btn-send { background:linear-gradient(135deg,#2563eb,#3b82f6); box-shadow:0 3px 10px rgba(59,130,246,0.28); transition:all 0.22s; }
        .btn-send:hover { transform:translateY(-1px); box-shadow:0 6px 16px rgba(59,130,246,0.38); }

        /* Shine */
        .btn-shine { position:absolute;inset:0;background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.12) 50%,transparent 60%);background-size:200% 100%;animation:shine 3s linear infinite; }
        @keyframes shine { from{background-position:200% 0} to{background-position:-200% 0} }

        /* Pagination */
        .page-btn { width:34px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;border:1.5px solid #e2e8f0;background:white;color:#64748b;transition:all 0.18s; }
        .page-btn:hover { border-color:#3b82f6;color:#2563eb;background:#eff6ff; }
        .page-btn.active { background:linear-gradient(135deg,#2563eb,#3b82f6);border-color:transparent;color:white;box-shadow:0 3px 10px rgba(59,130,246,0.28); }

        /* Stagger */
        .row-fade { animation:rowFade 0.4s cubic-bezier(0.4,0,0.2,1) both; }
        @keyframes rowFade { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

        /* Stat pill in header */
        .stat-pill { background:linear-gradient(135deg,#eff6ff,#f0f9ff); border:1.5px solid #bfdbfe; }

        /* Logo badge */
        .logo-badge { background:linear-gradient(135deg,#1d4ed8,#3b82f6); box-shadow:0 3px 10px rgba(59,130,246,0.30); }

        /* Overdue row highlight */
        .table-row.overdue-row:hover { box-shadow:inset 3px 0 0 #ef4444; }

        /* Scrollbar */
        .comments-scroll::-webkit-scrollbar { width:4px; }
        .comments-scroll::-webkit-scrollbar-track { background:#f1f5f9; border-radius:99px; }
        .comments-scroll::-webkit-scrollbar-thumb { background:#bfdbfe; border-radius:99px; }
      `}</style>

      <div className="dash-root min-h-screen flex font-body">

        {/* ══════════════════════════════════════
            SIDEBAR
        ══════════════════════════════════════ */}
        <aside className="sidebar fixed left-0 top-0 bottom-0 w-64 z-40 flex flex-col">
          {/* Logo */}
          <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-100">
            <div className="logo-badge w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
              </svg>
            </div>
            <div>
              <h1 className="font-display text-slate-800 text-base font-medium">Eventraze</h1>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-500">Approval Portal</p>
            </div>
          </div>

          {/* Nav items */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 px-3 pt-1 pb-2">Queue</p>
            <SideNavItem icon={<Clock size={16} />}       label="Pending"    count={statusCounts.pending}  active={activeNav==="pending"}    onClick={() => setActiveNav("pending")} />
            <SideNavItem icon={<Eye size={16} />}         label="In Review"  count={statusCounts.inReview} active={activeNav==="in-review"}  onClick={() => setActiveNav("in-review")} />
            <SideNavItem icon={<Check size={16} />}       label="Completed"  active={activeNav==="completed"} onClick={() => setActiveNav("completed")} />
            <SideNavItem icon={<AlertTriangle size={16} />} label="Overdue"  count={statusCounts.overdue}  danger active={activeNav==="overdue"}   onClick={() => setActiveNav("overdue")} />

            <div className="pt-3 mt-3 border-t border-slate-100">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 px-3 pb-2">Account</p>
              <SideNavItem icon={<Clock size={16} />}    label="My History" active={activeNav==="history"} onClick={() => setActiveNav("history")} />
            </div>
          </nav>

          {/* User info */}
          <div className="px-4 py-4 border-t border-slate-100">
            <Link to="/profile" className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group">
              <Avatar name="Dr. Sarah Mitchell" size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-700 truncate">Dr. Sarah Mitchell</p>
                <p className="text-[11px] text-slate-400 truncate">Dean of Faculty</p>
              </div>
              <Settings size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors flex-shrink-0" />
            </Link>
          </div>
        </aside>

        {/* ══════════════════════════════════════
            MAIN CONTENT
        ══════════════════════════════════════ */}
        <div className="ml-64 flex-1 flex flex-col min-h-screen">

          {/* Header */}
          <header className="dash-header sticky top-0 z-30 px-6 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="font-display text-xl font-medium text-slate-800">Approval Dashboard</h1>
              <span className="stat-pill text-xs font-bold text-blue-700 px-3 py-1 rounded-full">Dean of Faculty</span>
            </div>
            <div className="flex items-center gap-3">
              {/* Notification bell */}
              <button className="relative w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white" />
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium text-slate-500
                  bg-white border border-slate-200 hover:border-red-200 hover:text-red-600 hover:bg-red-50
                  transition-all duration-200 shadow-sm">
                <LogOut size={14} />
                Logout
              </button>
            </div>
          </header>

          {/* Filter bar */}
          <div className="filter-bar px-6 py-3.5 flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[220px] max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
              <input
                type="text"
                placeholder="Search by organizer or event…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input w-full pl-10 pr-4 py-2.5 text-sm text-slate-700"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Status filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select appearance-none pl-3.5 pr-9 py-2.5 text-sm text-slate-600 font-medium cursor-pointer shadow-sm">
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-review">In Review</option>
                <option value="overdue">Overdue</option>
              </select>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </div>

            {/* Date range */}
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
              bg-white border border-slate-200 text-slate-600 shadow-sm
              hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all">
              <Calendar size={14} />
              Date Range
            </button>

            {/* Reset */}
            {(searchQuery || statusFilter !== "all") && (
              <button
                onClick={() => { setSearchQuery(""); setStatusFilter("all"); }}
                className="text-sm font-medium text-slate-400 hover:text-red-500 transition-colors">
                Reset
              </button>
            )}

            {/* Results count */}
            <span className="ml-auto text-xs font-semibold text-slate-400">
              {filteredEvents.length} events
            </span>
          </div>

          {/* Content area */}
          <div className="flex-1 p-5 flex gap-5 overflow-hidden">

            {/* ── Events Table ── */}
            <div className={`flex-1 flex flex-col events-table overflow-hidden ${selectedEvent ? "min-w-0" : ""}`}>
              <div className="overflow-x-auto flex-1">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="p-3.5 w-10">
                        <input type="checkbox" className="w-4 h-4 accent-blue-500 rounded" />
                      </th>
                      {["Event Title", "Organizer", "Submitted", "Status", "Actions"].map(h => (
                        <th key={h} className="p-3.5 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEvents.map((event, idx) => (
                      <tr
                        key={event.id}
                        className={`table-row row-fade cursor-pointer ${selectedEvent?.id === event.id ? "selected" : ""} ${event.status === "Overdue" ? "overdue-row" : ""}`}
                        style={{ animationDelay:`${idx*0.05}s` }}
                        onClick={() => setSelectedEvent(event)}
                      >
                        <td className="p-3.5 w-10">
                          <input type="checkbox" className="w-4 h-4 accent-blue-500 rounded"
                            onClick={e => e.stopPropagation()} />
                        </td>

                        {/* Title */}
                        <td className="p-3.5 max-w-[220px]">
                          <p className={`text-sm font-semibold truncate ${selectedEvent?.id === event.id ? "text-blue-700" : "text-slate-700"}`}>
                            {event.title}
                          </p>
                          {event.dueDate && (
                            <p className="text-[11px] text-red-500 flex items-center gap-1 mt-0.5">
                              <AlertTriangle size={10} />
                              Due: {event.dueDate}
                            </p>
                          )}
                        </td>

                        {/* Organizer */}
                        <td className="p-3.5">
                          <div className="flex items-center gap-2.5">
                            <Avatar name={event.organizer} size="sm" />
                            <span className="text-sm text-slate-600 whitespace-nowrap">{event.organizer}</span>
                          </div>
                        </td>

                        {/* Date */}
                        <td className="p-3.5 text-sm text-slate-400 whitespace-nowrap">{event.submissionDate}</td>

                        {/* Status */}
                        <td className="p-3.5"><StatusBadge status={event.status} /></td>

                        {/* Actions */}
                        <td className="p-3.5">
                          <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                            <button className="action-icon action-icon-view"    title="View"><Eye size={13} /></button>
                            <button className="action-icon action-icon-comment" title="Comment"><MessageCircle size={13} /></button>
                            <button className="action-icon action-icon-check"   title="Approve"><Check size={13} /></button>
                            <button className="action-icon action-icon-x"       title="Reject"><X size={13} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between bg-white">
                <p className="text-xs text-slate-400">Showing <span className="font-semibold text-slate-600">{filteredEvents.length}</span> of 13 events</p>
                <div className="flex items-center gap-1.5">
                  <button className="page-btn"><ChevronLeft size={14} /></button>
                  {[1,2,3].map(n => (
                    <button key={n} className={`page-btn ${n===1?"active":""}`}>{n}</button>
                  ))}
                  <button className="page-btn"><ChevronRight size={14} /></button>
                </div>
              </div>
            </div>

            {/* ── Detail Panel ── */}
            {selectedEvent && (
              <div className="detail-panel w-[360px] flex-shrink-0 flex flex-col max-h-[calc(100vh-180px)] overflow-hidden">
                {/* Panel header */}
                <div className="h-[3px] bg-gradient-to-r from-blue-500 via-indigo-400 to-sky-400 flex-shrink-0" />
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 flex-shrink-0">
                  <h3 className="font-display text-base font-medium text-slate-800">Event Details</h3>
                  <button onClick={() => setSelectedEvent(null)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400
                      hover:text-red-500 hover:bg-red-50 transition-all">
                    <X size={14} />
                  </button>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto p-5 space-y-5 comments-scroll">

                  {/* Event info card */}
                  <div className="event-info-card p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-display text-sm font-semibold text-slate-800 leading-snug">
                        {selectedEvent.title}
                      </h4>
                      <StatusBadge status={selectedEvent.status} />
                    </div>
                    <div className="grid grid-cols-1 gap-1.5">
                      {[
                        { icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-blue-400"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, label:selectedEvent.organizer },
                        { icon:<Calendar size={13} className="text-blue-400" />,                                                                                                                                                                     label:selectedEvent.eventDate },
                        { icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-blue-400"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>, label:selectedEvent.location },
                        { icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-blue-400"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>, label:`${selectedEvent.expectedAttendees} attendees` },
                      ].map(({ icon, label }, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                          {icon} {label}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Description</p>
                    <p className="text-sm text-slate-600 leading-relaxed">{selectedEvent.description}</p>
                  </div>

                  {/* Documents */}
                  {selectedEvent.documents.length > 0 && (
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Attached Documents ({selectedEvent.documents.length})
                      </p>
                      <div className="space-y-2">
                        {selectedEvent.documents.map((doc, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-200 hover:bg-blue-50 transition-all group">
                            <div className="flex items-center gap-2">
                              <FileText size={14} className="text-blue-400" />
                              <span className="text-xs font-medium text-slate-600">{doc}</span>
                            </div>
                            <button className="text-slate-400 group-hover:text-blue-500 transition-colors">
                              <Download size={13} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Comments */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Comments</p>
                      <span className="text-[10px] font-bold text-blue-500 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                        {selectedEvent.comments.length}
                      </span>
                    </div>

                    <div className="space-y-2.5 max-h-48 overflow-y-auto comments-scroll">
                      {selectedEvent.comments.length > 0 ? selectedEvent.comments.map((c, idx) => (
                        <div key={idx} className="comment-item p-3">
                          <div className="flex items-start gap-2.5 mb-1.5">
                            <Avatar name={c.author} size="sm" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-semibold text-slate-700 truncate">{c.author}</span>
                                <span className="text-[10px] text-slate-400 flex-shrink-0">{c.time}</span>
                              </div>
                              {c.role && <span className="text-[10px] text-slate-400">{c.role}</span>}
                            </div>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed pl-9">{c.text}</p>
                        </div>
                      )) : (
                        <p className="text-xs text-slate-400 text-center py-4">No comments yet.</p>
                      )}
                    </div>

                    {/* Comment input */}
                    <div className="flex gap-2 mt-3">
                      <input
                        type="text"
                        placeholder="Add a comment…"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="search-input flex-1 px-3.5 py-2 text-sm text-slate-700"
                      />
                      <button className="btn-send px-3.5 py-2 rounded-xl text-white text-xs font-semibold relative overflow-hidden">
                        <div className="btn-shine" />
                        <span className="relative z-10">Send</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action buttons — fixed at bottom */}
                <div className="flex-shrink-0 p-4 border-t border-slate-100 space-y-2 bg-white">
                  <button className="btn-approve w-full py-2.5 rounded-xl text-sm font-semibold text-white relative overflow-hidden flex items-center justify-center gap-2">
                    <div className="btn-shine" />
                    <span className="relative z-10 flex items-center gap-2"><Check size={14} /> Approve</span>
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="btn-reject py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
                      <X size={13} /> Reject
                    </button>
                    <button className="btn-revision py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                      Revise
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ApprovalDashboard;