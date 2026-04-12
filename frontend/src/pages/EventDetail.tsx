import { Link } from "react-router-dom";
import {
  Check, Clock, AlertCircle, X, Download, Edit,
  XCircle, Calendar, MapPin, Users, ChevronDown,
  Search, Bell, Menu,
} from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";

/* ─────────────────────────────────────────
   STEP STATUS CONFIG — light palette
───────────────────────────────────────── */
const stepConfig: Record<string, {
  ring: string; bg: string; icon: React.ReactNode;
  badge: string; bar: string; glow: string;
}> = {
  Completed: {
    ring:  "border-emerald-300",
    bg:    "bg-emerald-50",
    icon:  <Check size={15} className="text-emerald-600" />,
    badge: "bg-emerald-50 border border-emerald-200 text-emerald-700",
    bar:   "from-emerald-400 to-teal-400",
    glow:  "rgba(52,211,153,0.25)",
  },
  "In Progress": {
    ring:  "border-blue-300",
    bg:    "bg-blue-50",
    icon:  <Clock size={15} className="text-blue-600" />,
    badge: "bg-blue-50 border border-blue-200 text-blue-700",
    bar:   "from-blue-400 to-indigo-400",
    glow:  "rgba(59,130,246,0.25)",
  },
  Pending: {
    ring:  "border-slate-200",
    bg:    "bg-slate-50",
    icon:  <Clock size={15} className="text-slate-400" />,
    badge: "bg-slate-100 border border-slate-200 text-slate-500",
    bar:   "from-slate-300 to-slate-300",
    glow:  "transparent",
  },
  Skipped: {
    ring:  "border-red-200",
    bg:    "bg-red-50",
    icon:  <X size={15} className="text-red-500" />,
    badge: "bg-red-50 border border-red-200 text-red-600",
    bar:   "from-red-300 to-rose-300",
    glow:  "rgba(239,68,68,0.20)",
  },
};

const StepIcon = ({ status }: { status: string }) => {
  const cfg = stepConfig[status] ?? stepConfig.Pending;
  return (
    <div className={`step-icon-ring w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 ${cfg.ring} ${cfg.bg}`}
      style={{ boxShadow: `0 0 0 4px ${cfg.glow}` }}>
      {cfg.icon}
    </div>
  );
};

/* ─────────────────────────────────────────
   REUSABLE CARD
───────────────────────────────────────── */
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`detail-card bg-white border border-slate-200/80 rounded-2xl p-6 ${className}`}>
    {children}
  </div>
);

const SectionTitle = ({ children, accent = "blue" }: { children: React.ReactNode; accent?: string }) => (
  <div className="flex items-center gap-2.5 mb-6">
    <div className={`w-1 h-5 rounded-full bg-gradient-to-b ${accent === "blue" ? "from-blue-500 to-indigo-400" : "from-slate-300 to-slate-200"}`} />
    <h2 className="font-display text-[1.1rem] font-medium text-slate-800 tracking-tight">{children}</h2>
  </div>
);

/* ─────────────────────────────────────────
   AVATAR MONOGRAM
───────────────────────────────────────── */
const Avatar = ({ name, size = "sm" }: { name: string; size?: "sm" | "md" }) => {
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const colors = ["from-blue-400 to-indigo-500", "from-emerald-400 to-teal-500", "from-violet-400 to-purple-500", "from-amber-400 to-orange-500"];
  const color = colors[name.charCodeAt(0) % colors.length];
  const sz = size === "md" ? "w-10 h-10 text-sm" : "w-8 h-8 text-xs";
  return (
    <div className={`${sz} rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold flex-shrink-0`}>
      {initials}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════ */
const EventDetail = () => {
  const event = {
    id: "AC",
    title: "Annual Company Retreat 2025",
    status: "In Review",
    organizer: "Sarah Johnson",
    submittedDate: "Jan 15, 2025",
    eventDate: "Mar 15-17, 2025",
    location: "Mountain Resort",
    expectedAttendees: 120,
    currentStep: 2,
    steps: [
      { id:1, title:"Head of Section",  status:"Completed",   approver:"Michael Chen",     approvedAt:"Jan 16, 2025 at 10:30 AM" },
      { id:2, title:"Deputy Director",  status:"In Progress", assignee:"Jennifer Williams", pendingSince:"Jan 16, 2025 at 2:15 PM", note:"This approval step typically takes 2-3 business days" },
      { id:3, title:"Welfare Unit",     status:"Pending",     note:"Will be assigned after Step 2 completion" },
      { id:4, title:"Admin",            status:"Skipped",     reason:"Not applicable for internal events" },
    ],
    comments: [
      { author:"Michael Chen",  role:"Head of Section",  date:"Jan 16, 2025 at 10:30 AM", status:"Approved",
        text:"Excellent proposal! The retreat plan is well-structured and the budget allocation looks reasonable. Approved for next level review." },
      { author:"Sarah Johnson", role:"Event Organizer",  date:"Jan 15, 2025 at 3:45 PM",
        text:"Event submitted for approval. All documentation and budget breakdown attached." },
    ],
  };

  const completedSteps = event.steps.filter(s => s.status === "Completed").length;
  const progressPct = Math.round((completedSteps / event.steps.length) * 100);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Playfair Display', Georgia, serif; }
        .font-body    { font-family: 'DM Sans', system-ui, sans-serif; }

        .detail-root { font-family: 'DM Sans', system-ui, sans-serif; }

        /* Header glass */
        .detail-header {
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(20px) saturate(180%);
          border-bottom: 1px solid rgba(226,232,240,0.8);
          box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(59,130,246,0.05);
        }

        /* Cards */
        .detail-card {
          box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(59,130,246,0.05);
          transition: box-shadow 0.22s, transform 0.22s;
        }
        .detail-card:hover {
          box-shadow: 0 4px 8px rgba(0,0,0,0.05), 0 16px 32px rgba(59,130,246,0.08);
        }

        /* Progress bar */
        .progress-track { height:6px; border-radius:99px; background:#e2e8f0; position:relative; overflow:hidden; }
        .progress-fill {
          position:absolute; left:0; top:0; bottom:0; border-radius:99px;
          background: linear-gradient(90deg, #2563eb, #818cf8, #0ea5e9);
          box-shadow: 0 0 10px rgba(59,130,246,0.35);
          transition: width 0.7s cubic-bezier(0.4,0,0.2,1);
        }

        /* Workflow connector */
        .workflow-connector {
          position: absolute;
          left: 19px; top: 44px; bottom: 0;
          width: 2px;
          background: linear-gradient(to bottom, #e2e8f0 0%, #f1f5f9 100%);
        }

        /* Step card */
        .step-card {
          background: white;
          border: 1.5px solid #f1f5f9;
          border-radius: 16px;
          transition: all 0.2s;
        }
        .step-card:hover { border-color: #bfdbfe; box-shadow: 0 4px 16px rgba(59,130,246,0.08); }
        .step-card.active-step {
          border-color: #bfdbfe;
          box-shadow: 0 4px 20px rgba(59,130,246,0.12);
          background: linear-gradient(135deg, #fafcff, #eff6ff);
        }

        /* Action buttons */
        .btn-download {
          background: linear-gradient(135deg, #2563eb, #3b82f6, #0ea5e9);
          box-shadow: 0 4px 14px rgba(59,130,246,0.30);
          transition: all 0.22s; position:relative; overflow:hidden;
        }
        .btn-download:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(59,130,246,0.40); }
        .btn-download::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,#1d4ed8,#2563eb); opacity:0; transition:opacity 0.22s; }
        .btn-download:hover::before { opacity:1; }
        .btn-download-label { position:relative; z-index:1; }
        .btn-shine { position:absolute; inset:0; background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.10) 50%,transparent 60%); background-size:200% 100%; animation:shine 3s linear infinite; }
        @keyframes shine { from{background-position:200% 0} to{background-position:-200% 0} }

        .btn-edit {
          background:white; border:1.5px solid #e2e8f0;
          transition:all 0.2s;
        }
        .btn-edit:hover { border-color:#3b82f6; color:#2563eb; background:#eff6ff; transform:translateY(-1px); }

        .btn-cancel {
          background:#fef2f2; border:1.5px solid #fecaca;
          transition:all 0.2s;
        }
        .btn-cancel:hover { background:#fee2e2; border-color:#fca5a5; transform:translateY(-1px); }

        /* Comment card */
        .comment-card {
          background:white; border:1.5px solid #f1f5f9; border-radius:16px;
          transition:all 0.18s;
        }
        .comment-card:hover { border-color:#bfdbfe; box-shadow:0 4px 16px rgba(59,130,246,0.07); }

        /* Stagger fade */
        .fade-up { animation: fadeUp 0.55s cubic-bezier(0.4,0,0.2,1) both; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .d1{animation-delay:0.05s} .d2{animation-delay:0.12s}
        .d3{animation-delay:0.19s} .d4{animation-delay:0.26s}
        .d5{animation-delay:0.32s}

        /* Background */
        .detail-bg {
          background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
          position:relative;
        }
        .dot-grid {
          position:fixed; inset:0; pointer-events:none; opacity:0.018; z-index:0;
          background-image: radial-gradient(#1e40af 1px, transparent 1px);
          background-size: 28px 28px;
        }

        /* Status badge on event header */
        .status-badge-review {
          background: linear-gradient(135deg, #eff6ff, #f0f9ff);
          border: 1.5px solid #bfdbfe;
          box-shadow: 0 2px 8px rgba(59,130,246,0.12);
        }

        /* Breadcrumb */
        .breadcrumb-sep { color:#cbd5e1; }

        /* Monogram tile */
        .monogram-tile {
          background: linear-gradient(135deg, #eff6ff, #e0f2fe);
          border: 1.5px solid #bfdbfe;
          box-shadow: 0 4px 12px rgba(59,130,246,0.12);
        }

        /* Summary row */
        .summary-row {
          display:flex; align-items:flex-start; justify-content:space-between; gap:12px;
          padding: 10px 0;
          border-bottom: 1px solid #f1f5f9;
        }
        .summary-row:last-child { border-bottom:none; }

        /* Nav link */
        .nav-link-active { background:#eff6ff; color:#2563eb; }
        .nav-link-inactive { color:#64748b; }
        .nav-link-inactive:hover { background:#f8fafc; color:#334155; }

        /* Quick action card */
        .actions-card {
          background: linear-gradient(160deg, #eff6ff 0%, #f0f9ff 100%);
          border: 1.5px solid #bfdbfe;
          box-shadow: 0 4px 20px rgba(59,130,246,0.10);
        }

        /* Pulse dot */
        .pulse-dot { animation: pulseDot 2s ease infinite; }
        @keyframes pulseDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.6)} }

        /* Footer */
        .detail-footer {
          background: white;
          border-top: 1px solid #e2e8f0;
        }
      `}</style>

      <div className="detail-root detail-bg min-h-screen flex flex-col">
        <div className="dot-grid" />

        <MainLayout title="Event Detail" subtitle="Review and manage your event submission">

          {/* Breadcrumb */}
          <div className="relative z-10 max-w-[1200px] mx-auto w-full px-6 py-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Link to="/my-events" className="hover:text-blue-600 transition-colors font-medium">Dashboard</Link>
              <span className="breadcrumb-sep">›</span>
              <Link to="/my-events" className="hover:text-blue-600 transition-colors font-medium">My Events</Link>
              <span className="breadcrumb-sep">›</span>
              <span className="text-slate-600 font-medium truncate max-w-[200px]">{event.title}</span>
            </div>
          </div>

          {/* ══════════════════════════════════════
              PAGE BODY
          ══════════════════════════════════════ */}
          <main className="relative z-10 max-w-[1200px] mx-auto w-full px-6 pb-16 flex-1">

            {/* ── Event header card ── */}
            <div className="fade-up d1 detail-card bg-white border border-slate-200/80 rounded-2xl p-6 mb-5 overflow-hidden">
              {/* Top accent bar */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 via-indigo-400 to-sky-400" />

              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pt-1">
                <div className="flex items-start gap-4">
                  {/* Monogram */}
                  <div className="monogram-tile w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center">
                    <span className="font-display text-xl font-semibold text-blue-600">{event.id}</span>
                  </div>

                  <div>
                    <h1 className="font-display text-[1.6rem] font-medium leading-tight text-slate-800 mb-2">
                      {event.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Users size={12} className="text-blue-400" />
                        Organized by <span className="font-medium text-slate-600 ml-1">{event.organizer}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar size={12} className="text-blue-400" />
                        Submitted <span className="font-medium text-slate-600 ml-1">{event.submittedDate}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status badge */}
                <div className="self-start status-badge-review flex items-center gap-2 px-3.5 py-2 rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-blue-500 pulse-dot" />
                  <span className="text-xs font-bold tracking-wide text-blue-700">{event.status}</span>
                </div>
              </div>

              {/* Progress */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Approval Progress</span>
                    <span className="text-xs font-bold text-blue-500 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                      {progressPct}%
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">
                    Step <span className="font-semibold text-slate-700">{event.currentStep}</span> of {event.steps.length}
                  </span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width:`${progressPct}%` }} />
                </div>
                {/* Step labels */}
                <div className="grid grid-cols-4 mt-2">
                  {event.steps.map((step) => (
                    <div key={step.id} className={`text-center text-[10px] font-semibold uppercase tracking-wider ${
                      step.status === "Completed"   ? "text-emerald-500" :
                      step.status === "In Progress" ? "text-blue-500"    :
                      step.status === "Skipped"     ? "text-red-400"     : "text-slate-300"
                    }`}>
                      {step.id}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

              {/* ══════════════════════════════════
                  LEFT: Approval Workflow
              ══════════════════════════════════ */}
              <div className="lg:col-span-2 fade-up d2">
                <Card>
                  <SectionTitle>Approval Workflow</SectionTitle>

                  <div className="relative">
                    {/* Connector line */}
                    <div className="workflow-connector" />

                    <div className="flex flex-col gap-3">
                      {event.steps.map((step, index) => {
                        const cfg = stepConfig[step.status] ?? stepConfig.Pending;
                        const isActive = step.status === "In Progress";
                        const isDone   = step.status === "Completed";
                        const isLast   = index === event.steps.length - 1;

                        return (
                          <div key={step.id} className={`relative flex gap-4 ${isLast ? "" : "pb-0"}`}>
                            {/* Step icon */}
                            <div className="z-[1] mt-3 flex-shrink-0">
                              <StepIcon status={step.status} />
                            </div>

                            {/* Step card */}
                            <div className={`flex-1 step-card p-4 ${isActive ? "active-step" : ""}`}>
                              {/* Title row */}
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span className={`text-sm font-semibold ${isActive ? "text-blue-800" : isDone ? "text-slate-700" : "text-slate-500"}`}>
                                  Step {step.id}: {step.title}
                                </span>
                                <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.08em] uppercase px-2.5 py-1 rounded-full ${cfg.badge}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${cfg.bar}`} />
                                  {step.status}
                                </span>
                              </div>

                              {/* Meta */}
                              <div className="flex flex-col gap-1 mb-2">
                                {step.approver && (
                                  <p className="flex items-center gap-2 text-xs text-slate-500">
                                    <Users size={11} className="text-blue-400" />
                                    Approved by <span className="font-semibold text-slate-700">{step.approver}</span>
                                  </p>
                                )}
                                {step.assignee && (
                                  <p className="flex items-center gap-2 text-xs text-slate-500">
                                    <Users size={11} className="text-blue-400" />
                                    Assigned to <span className="font-semibold text-slate-700">{step.assignee}</span>
                                  </p>
                                )}
                                {step.approvedAt && (
                                  <p className="flex items-center gap-2 text-xs text-slate-400">
                                    <Calendar size={11} className="text-slate-300" />
                                    {step.approvedAt}
                                  </p>
                                )}
                                {step.pendingSince && (
                                  <p className="flex items-center gap-2 text-xs text-slate-400">
                                    <Clock size={11} className="text-blue-400" />
                                    Pending since {step.pendingSince}
                                  </p>
                                )}
                              </div>

                              {/* Note box */}
                              {step.note && step.status !== "Skipped" && (
                                <div className={`mt-1.5 px-3 py-2.5 rounded-xl text-xs leading-relaxed
                                  ${isActive
                                    ? "bg-blue-50 border border-blue-100 text-blue-700"
                                    : "bg-slate-50 border border-slate-100 text-slate-500"
                                  }`}>
                                  <div className="flex items-start gap-2">
                                    <AlertCircle size={12} className={`mt-0.5 flex-shrink-0 ${isActive ? "text-blue-400" : "text-slate-300"}`} />
                                    <div>
                                      {isActive && <p className="font-semibold mb-0.5">Awaiting Review</p>}
                                      <p>{step.note}</p>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Skipped reason */}
                              {step.reason && (
                                <p className="flex items-center gap-2 text-xs text-red-400 mt-1.5">
                                  <AlertCircle size={11} /> {step.reason}
                                </p>
                              )}

                              {/* Expand comments */}
                              <button className="mt-2 flex items-center gap-1 text-[11px] text-slate-400
                                hover:text-blue-500 transition-colors duration-150 font-medium">
                                <ChevronDown size={12} />
                                View comments &amp; feedback
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Card>
              </div>

              {/* ══════════════════════════════════
                  RIGHT SIDEBAR
              ══════════════════════════════════ */}
              <div className="flex flex-col gap-4">

                {/* Quick Actions */}
                <div className="fade-up d3 actions-card rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full opacity-30 pointer-events-none"
                    style={{ background:"radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)" }} />

                  <SectionTitle>Quick Actions</SectionTitle>

                  <div className="flex flex-col gap-2.5">
                    <button className="btn-download w-full flex items-center justify-center gap-2
                      py-2.5 px-4 rounded-xl text-sm font-semibold text-white">
                      <div className="btn-shine" />
                      <span className="btn-download-label flex items-center gap-2">
                        <Download size={14} /> Download Document
                      </span>
                    </button>

                    <button className="btn-edit w-full flex items-center justify-center gap-2
                      py-2.5 px-4 rounded-xl text-sm font-semibold text-slate-600">
                      <Edit size={14} /> Edit Event
                    </button>

                    <button className="btn-cancel w-full flex items-center justify-center gap-2
                      py-2.5 px-4 rounded-xl text-sm font-semibold text-red-600">
                      <XCircle size={14} /> Cancel Event
                    </button>
                  </div>
                </div>

                {/* Event Summary */}
                <div className="fade-up d4">
                  <Card>
                    <SectionTitle>Event Summary</SectionTitle>
                    <div>
                      {[
                        { label:"Event Date",         icon:<Calendar size={13} />, value:event.eventDate },
                        { label:"Location",           icon:<MapPin    size={13} />, value:event.location },
                        { label:"Attendees",          icon:<Users     size={13} />, value:`${event.expectedAttendees} people` },
                        { label:"Approval Status",    icon:<Clock     size={13} />, value:`Step ${event.currentStep} of ${event.steps.length}` },
                      ].map(({ label, icon, value }) => (
                        <div key={label} className="summary-row">
                          <div className="flex items-center gap-1.5 text-xs text-slate-400 flex-shrink-0">
                            <span className="text-blue-400">{icon}</span>
                            {label}
                          </div>
                          <span className="text-xs font-semibold text-slate-700 text-right">{value}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            </div>

            {/* ══════════════════════════════════════
                COMMENTS & FEEDBACK
            ══════════════════════════════════════ */}
            <div className="fade-up d5 mt-5">
              <Card>
                <SectionTitle>Comments &amp; Feedback History</SectionTitle>

                <div className="flex flex-col gap-3">
                  {event.comments.map((comment, idx) => (
                    <div key={idx} className="comment-card p-4">
                      <div className="flex gap-3">
                        <Avatar name={comment.author} size="md" />

                        <div className="flex-1 min-w-0">
                          {/* Author row */}
                          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 mb-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-sm font-semibold text-slate-800">{comment.author}</span>
                              <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{comment.role}</span>
                              {comment.status && (
                                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full
                                  bg-emerald-50 border border-emerald-200 text-emerald-700">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                  {comment.status}
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400">{comment.date}</span>
                          </div>

                          {/* Body */}
                          <p className="text-sm leading-[1.7] text-slate-600">{comment.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </main>

        </MainLayout>
      </div>
    </>
  );
};

export default EventDetail;