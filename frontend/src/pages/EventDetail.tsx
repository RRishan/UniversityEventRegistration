import { Link } from "react-router-dom";
import {
  Check, Clock, AlertCircle, X, Download, Edit,
  XCircle, Calendar, MapPin, Users, ChevronDown,
  Search, Bell, Menu,
} from "lucide-react";

/* ── Step status config ──────────────────────────────────── */
const stepConfig: Record<
  string,
  { ring: string; bg: string; icon: React.ReactNode; badge: string }
> = {
  Completed: {
    ring:  "border-[rgba(74,222,128,0.5)]",
    bg:    "bg-[rgba(74,222,128,0.12)]",
    icon:  <Check size={16} className="text-[#4ade80]" />,
    badge: "bg-[rgba(74,222,128,0.1)] border border-[rgba(74,222,128,0.25)] text-[#4ade80]",
  },
  "In Progress": {
    ring:  "border-[rgba(255,190,60,0.5)]",
    bg:    "bg-[rgba(255,190,60,0.1)]",
    icon:  <Clock size={16} className="text-[#ffbe3c]" />,
    badge: "bg-[rgba(255,190,60,0.1)] border border-[rgba(255,190,60,0.3)] text-[#ffbe3c]",
  },
  Pending: {
    ring:  "border-white/[0.15]",
    bg:    "bg-white/[0.04]",
    icon:  <Clock size={16} className="text-white/30" />,
    badge: "bg-white/[0.05] border border-white/[0.1] text-white/35",
  },
  Skipped: {
    ring:  "border-[rgba(255,107,107,0.35)]",
    bg:    "bg-[rgba(255,107,107,0.08)]",
    icon:  <X size={16} className="text-[#ff6b6b]" />,
    badge: "bg-[rgba(255,107,107,0.08)] border border-[rgba(255,107,107,0.2)] text-[#ff6b6b]",
  },
};

const StepIcon = ({ status }: { status: string }) => {
  const cfg = stepConfig[status] ?? stepConfig.Pending;
  return (
    <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center shrink-0 ${cfg.ring} ${cfg.bg}`}>
      {cfg.icon}
    </div>
  );
};

/* ── Reusable section card ───────────────────────────────── */
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white/[0.025] border border-white/[0.07] rounded-[18px] p-6 ${className}`}>
    {children}
  </div>
);

/* ── Section heading ─────────────────────────────────────── */
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-display text-[1.25rem] font-normal text-[#f0ede8] mb-6 tracking-[0.01em]">
    {children}
  </h2>
);

/* ══════════════════════════════════════════════════════════ */
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
      {
        id: 1,
        title: "Head of Section",
        status: "Completed",
        approver: "Michael Chen",
        approvedAt: "Jan 16, 2025 at 10:30 AM",
      },
      {
        id: 2,
        title: "Deputy Director",
        status: "In Progress",
        assignee: "Jennifer Williams",
        pendingSince: "Jan 16, 2025 at 2:15 PM",
        note: "This approval step typically takes 2-3 business days",
      },
      {
        id: 3,
        title: "Welfare Unit",
        status: "Pending",
        note: "Will be assigned after Step 2 completion",
      },
      {
        id: 4,
        title: "Admin",
        status: "Skipped",
        reason: "Not applicable for internal events",
      },
    ],
    comments: [
      {
        author: "Michael Chen",
        role: "Head of Section",
        date: "Jan 16, 2025 at 10:30 AM",
        status: "Approved",
        text: "Excellent proposal! The retreat plan is well-structured and the budget allocation looks reasonable. Approved for next level review.",
      },
      {
        author: "Sarah Johnson",
        role: "Event Organizer",
        date: "Jan 15, 2025 at 3:45 PM",
        text: "Event submitted for approval. All documentation and budget breakdown attached.",
      },
    ],
  };

  /* Progress percentage for the tracker */
  const completedSteps = event.steps.filter((s) => s.status === "Completed").length;
  const progressPct = Math.round((completedSteps / event.steps.length) * 100);

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0b] font-body text-[#f0ede8]">

      {/* ══════════════════════════════════════
          HEADER  (keeps original nav links)
      ══════════════════════════════════════ */}
      <header className="sticky top-0 z-50
        bg-[rgba(10,10,11,0.82)] backdrop-blur-[18px]
        border-b border-white/[0.06]">
        <div className="max-w-[1200px] mx-auto px-6 h-[62px] flex items-center justify-between gap-4">

          {/* Left */}
          <div className="flex items-center gap-6">
            <button aria-label="Menu" className="text-white/35 hover:text-[#f0ede8] transition-colors">
              <Menu size={20} />
            </button>
            <nav className="hidden sm:flex items-center gap-1">
              {[
                { to: "/my-events", label: "Dashboard", active: true },
                { to: "/my-events", label: "My Events",  active: false },
                { to: "/calendar",  label: "Calendar",   active: false },
              ].map(({ to, label, active }) => (
                <Link key={label} to={to}
                  className={`px-3 py-1.5 rounded-lg text-[13px] transition-colors duration-150
                    ${active
                      ? "text-[#f0ede8] bg-white/[0.07]"
                      : "text-white/40 hover:text-white/75 hover:bg-white/[0.05]"
                    }`}>
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <span className="hidden md:block text-[11px] text-white/25 tracking-[0.04em]">
              3:51 PM GMT+7
            </span>
            <Link to="/event-registration"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5
                text-[12px] font-medium tracking-[0.06em] uppercase
                bg-transparent text-white/50 border border-white/[0.1] rounded-[8px]
                hover:border-[rgba(255,190,60,0.3)] hover:text-[#ffbe3c] hover:bg-[rgba(255,190,60,0.05)]
                transition-all duration-150">
              + Create Event
            </Link>
            <button aria-label="Search"  className="text-white/35 hover:text-[#f0ede8] transition-colors"><Search size={17} /></button>
            <button aria-label="Notifications" className="text-white/35 hover:text-[#f0ede8] transition-colors"><Bell size={17} /></button>
            <div className="w-8 h-8 rounded-full bg-[rgba(255,190,60,0.1)] border border-[rgba(255,190,60,0.22)]
              flex items-center justify-center text-[#ffbe3c]">
              <Users size={14} />
            </div>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════
          BREADCRUMB
      ══════════════════════════════════════ */}
      <div className="max-w-[1200px] mx-auto w-full px-6 py-4">
        <div className="flex items-center gap-1.5 text-[12px] text-white/30">
          <Link to="/my-events" className="hover:text-white/60 transition-colors">Dashboard</Link>
          <span>›</span>
          <Link to="/my-events" className="hover:text-white/60 transition-colors">My Events</Link>
          <span>›</span>
          <span className="text-white/55">{event.title}</span>
        </div>
      </div>

      {/* ══════════════════════════════════════
          PAGE BODY
      ══════════════════════════════════════ */}
      <main className="max-w-[1200px] mx-auto w-full px-6 pb-16 flex-1">

        {/* ── Event header card ── */}
        <Card className="mb-5">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

            <div className="flex items-start gap-4">
              {/* Monogram tile */}
              <div className="w-14 h-14 rounded-[14px] shrink-0
                bg-[rgba(255,190,60,0.1)] border border-[rgba(255,190,60,0.22)]
                flex items-center justify-center
                font-display text-lg font-normal text-[#ffbe3c]">
                {event.id}
              </div>

              <div>
                <h1 className="font-display text-[1.6rem] font-light leading-tight text-[#f0ede8] mb-2">
                  {event.title}
                </h1>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[12px] text-white/38">
                  <span className="flex items-center gap-1.5">
                    <Users size={12} className="text-white/25" />
                    Organized by {event.organizer}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={12} className="text-white/25" />
                    Submitted {event.submittedDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Status pill */}
            <span className="self-start inline-flex items-center gap-1.5
              px-3 py-1.5 rounded-full text-[11px] font-medium tracking-[0.06em] uppercase
              bg-[rgba(255,190,60,0.1)] border border-[rgba(255,190,60,0.25)] text-[#ffbe3c]">
              <Clock size={11} /> {event.status}
            </span>
          </div>

          {/* Progress bar */}
          <div className="mt-6 pt-5 border-t border-white/[0.06]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-white/30 tracking-[0.06em] uppercase">
                Approval progress
              </span>
              <span className="text-[11px] text-white/40">
                Step {event.currentStep} of {event.steps.length}
              </span>
            </div>
            <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#ffbe3c] to-[#ff8c00]
                  transition-all duration-700"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ══════════════════════════════════
              LEFT: Approval Workflow
          ══════════════════════════════════ */}
          <div className="lg:col-span-2">
            <Card>
              <SectionTitle>Approval Workflow</SectionTitle>

              <div className="relative">
                {/* Vertical connector line */}
                <div className="absolute left-[17px] top-9 bottom-9 w-px bg-white/[0.06]" />

                <div className="flex flex-col gap-0">
                  {event.steps.map((step, index) => {
                    const cfg = stepConfig[step.status] ?? stepConfig.Pending;
                    const isLast = index === event.steps.length - 1;
                    return (
                      <div key={step.id} className={`relative flex gap-5 ${isLast ? "" : "pb-7"}`}>

                        {/* Step icon */}
                        <div className="z-[1] mt-0.5">
                          <StepIcon status={step.status} />
                        </div>

                        {/* Step content */}
                        <div className="flex-1 min-w-0">
                          {/* Title row */}
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-[13px] font-medium text-[#f0ede8]">
                              Step {step.id}: {step.title}
                            </span>
                            <span className={`text-[10px] font-medium tracking-[0.07em] uppercase
                              px-2 py-0.5 rounded-full ${cfg.badge}`}>
                              {step.status}
                            </span>
                          </div>

                          {/* Meta lines */}
                          <div className="flex flex-col gap-1 mb-2">
                            {step.approver && (
                              <p className="flex items-center gap-1.5 text-[12px] text-white/38">
                                <Users size={11} className="text-white/25" />
                                Approved by <span className="text-white/55">{step.approver}</span>
                              </p>
                            )}
                            {step.assignee && (
                              <p className="flex items-center gap-1.5 text-[12px] text-white/38">
                                <Users size={11} className="text-white/25" />
                                Assigned to <span className="text-white/55">{step.assignee}</span>
                              </p>
                            )}
                            {step.approvedAt && (
                              <p className="flex items-center gap-1.5 text-[12px] text-white/38">
                                <Calendar size={11} className="text-white/25" />
                                {step.approvedAt}
                              </p>
                            )}
                            {step.pendingSince && (
                              <p className="flex items-center gap-1.5 text-[12px] text-white/38">
                                <Clock size={11} className="text-white/25" />
                                Pending since {step.pendingSince}
                              </p>
                            )}
                          </div>

                          {/* Note / awaiting box */}
                          {step.note && step.status !== "Skipped" && (
                            <div className="mt-1 mb-2 px-3 py-2.5
                              bg-white/[0.03] border border-white/[0.06] rounded-[9px]">
                              <p className="flex items-center gap-1.5 text-[12px] text-white/45">
                                <AlertCircle size={12} className="text-white/30 shrink-0" />
                                {step.status === "In Progress" ? "Awaiting Review" : step.note}
                              </p>
                              {step.status === "In Progress" && (
                                <p className="text-[11px] text-white/28 mt-1 pl-[18px]">{step.note}</p>
                              )}
                            </div>
                          )}

                          {/* Skipped reason */}
                          {step.reason && (
                            <p className="flex items-center gap-1.5 text-[12px] text-white/30 mt-1">
                              <AlertCircle size={11} />
                              {step.reason}
                            </p>
                          )}

                          {/* Expand comments */}
                          <button className="mt-1.5 flex items-center gap-1 text-[11px] text-white/28
                            hover:text-[#ffbe3c] transition-colors duration-150">
                            <ChevronDown size={13} />
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
          <div className="flex flex-col gap-5">

            {/* Quick Actions */}
            <div className="relative overflow-hidden rounded-[18px] p-6
              bg-gradient-to-br from-[rgba(255,190,60,0.14)] to-[rgba(255,140,0,0.08)]
              border border-[rgba(255,190,60,0.2)]">
              {/* Subtle glow */}
              <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full
                bg-[rgba(255,190,60,0.08)] blur-2xl pointer-events-none" />

              <h3 className="font-display text-[1rem] font-normal text-[#f0ede8] mb-4 relative z-[1]">
                Quick Actions
              </h3>

              <div className="flex flex-col gap-2.5 relative z-[1]">
                <button className="w-full flex items-center justify-center gap-2 py-2.5 px-4
                  bg-gradient-to-r from-[#ffbe3c] to-[#ff8c00] text-[#0a0a0b]
                  text-[12px] font-medium tracking-[0.06em] uppercase
                  rounded-[9px] shadow-[0_3px_16px_rgba(255,190,60,0.28)]
                  hover:opacity-90 hover:-translate-y-px transition-all duration-150">
                  <Download size={14} /> Download Document
                </button>

                <button className="w-full flex items-center justify-center gap-2 py-2.5 px-4
                  bg-white/[0.07] border border-white/[0.1] text-white/65
                  text-[12px] font-medium tracking-[0.06em] uppercase
                  rounded-[9px]
                  hover:bg-white/[0.11] hover:text-[#f0ede8] hover:border-white/[0.18]
                  transition-all duration-150">
                  <Edit size={14} /> Edit Event
                </button>

                <button className="w-full flex items-center justify-center gap-2 py-2.5 px-4
                  bg-[rgba(255,107,107,0.07)] border border-[rgba(255,107,107,0.15)] text-[#ff6b6b]/70
                  text-[12px] font-medium tracking-[0.06em] uppercase
                  rounded-[9px]
                  hover:bg-[rgba(255,107,107,0.12)] hover:text-[#ff6b6b] hover:border-[rgba(255,107,107,0.28)]
                  transition-all duration-150">
                  <XCircle size={14} /> Cancel Event
                </button>
              </div>
            </div>

            {/* Event Summary */}
            <Card>
              <h3 className="font-display text-[1rem] font-normal text-[#f0ede8] mb-4">
                Event Summary
              </h3>
              <div className="flex flex-col gap-3">
                {[
                  { label: "Event Date",          icon: <Calendar size={12} />, value: event.eventDate },
                  { label: "Location",             icon: <MapPin    size={12} />, value: event.location },
                  { label: "Expected Attendees",   icon: <Users     size={12} />, value: `${event.expectedAttendees} people` },
                  { label: "Approval Status",      icon: <Clock     size={12} />, value: `Step ${event.currentStep} of ${event.steps.length}` },
                ].map(({ label, icon, value }) => (
                  <div key={label} className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-1.5 text-[12px] text-white/35 shrink-0">
                      <span className="text-white/20">{icon}</span>
                      {label}
                    </div>
                    <span className="text-[12px] font-medium text-white/65 text-right">{value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* ══════════════════════════════════════
            COMMENTS & FEEDBACK HISTORY
        ══════════════════════════════════════ */}
        <Card className="mt-5">
          <SectionTitle>Comments &amp; Feedback History</SectionTitle>

          <div className="flex flex-col gap-4">
            {event.comments.map((comment, idx) => (
              <div key={idx}
                className="flex gap-4 p-4 bg-white/[0.02] border border-white/[0.05] rounded-[14px]">

                {/* Avatar */}
                <div className="w-9 h-9 rounded-full shrink-0
                  bg-[rgba(255,190,60,0.1)] border border-[rgba(255,190,60,0.18)]
                  flex items-center justify-center text-[#ffbe3c]">
                  <Users size={14} />
                </div>

                <div className="flex-1 min-w-0">
                  {/* Author row */}
                  <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 mb-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[13px] font-medium text-[#f0ede8]">{comment.author}</span>
                      <span className="text-[11px] text-white/30">{comment.role}</span>
                      {comment.status && (
                        <span className="text-[10px] font-medium tracking-[0.07em] uppercase
                          px-2 py-0.5 rounded-full
                          bg-[rgba(74,222,128,0.1)] border border-[rgba(74,222,128,0.22)] text-[#4ade80]">
                          {comment.status}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-white/25">{comment.date}</span>
                  </div>

                  {/* Body */}
                  <p className="text-[13px] leading-[1.65] text-white/45">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </main>

      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <footer className="border-t border-white/[0.05] py-5 mt-auto">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-white/20 tracking-[0.04em]">
            © {new Date().getFullYear()} <span className="text-[rgba(255,190,60,0.5)]">Eventraze</span> · Event Management Platform
          </p>
          <nav className="flex items-center gap-5">
            {[
              { to: "/help",    label: "Help Center"    },
              { to: "/privacy", label: "Privacy Policy" },
              { to: "/terms",   label: "Terms of Service" },
            ].map(({ to, label }) => (
              <Link key={to} to={to}
                className="text-[11px] text-white/22 hover:text-white/50 transition-colors duration-150">
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default EventDetail;