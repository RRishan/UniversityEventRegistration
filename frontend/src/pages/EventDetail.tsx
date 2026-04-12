import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { CheckCircle2, Clock3, XCircle, Calendar, MapPin, Users } from "lucide-react";

import MainLayout from "@/components/layout/MainLayout";
import { AppContext } from "@/context/AppContext";

type EventData = {
  _id: string;
  eventTitle: string;
  description: string;
  category: string;
  eventDate: string;
  expectedAttendees: number;
  startTime: string;
  endTime: string;
  venue: string;
  imageLink: string;
  isApproved: boolean;
  organizationId: string;
  classRoomName?: string;
};

type WorkflowItem = {
  _id: string;
  role: string;
  status: "approved" | "pending" | "rejected" | string;
  message?: string;
  updatedAt?: string;
};

const ROLE_LABELS: Record<string, string> = {
  headOfSection: "Head of Section",
  welfareOfficer: "Welfare Officer",
  sportDerector: "Sport Director",
  facultyDean: "Faculty Dean",
  chairmanOfArt: "Chairman of Art",
  proctor: "Proctor",
  viceChancellor: "Vice Chancellor",
  organizer: "Organizer",
  completed: "Completed",
};

const toTitleCase = (value: string) => {
  if (!value) return "Unknown";
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatRole = (role: string) => ROLE_LABELS[role] || toTitleCase(role);

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat("en-US", { weekday: "short", year: "numeric", month: "long", day: "numeric" }).format(date);
};

const formatDateTime = (dateString?: string) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

const formatTime = (time24: string) => {
  const [hourRaw, minuteRaw] = time24.split(":");
  const hour = Number(hourRaw);
  const minute = Number(minuteRaw);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return time24;

  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).format(date);
};

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const appContext = useContext(AppContext);

  if (!appContext) return null;

  const { backendUrl } = appContext;

  const [eventData, setEventData] = useState<EventData | null>(null);
  const [workflowItems, setWorkflowItems] = useState<WorkflowItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        axios.defaults.withCredentials = true;

        const eventResponse = await axios.get(`${backendUrl}/api/event/organization-events`);
        console.log(eventResponse.data)
        if (eventResponse.data?.success && Array.isArray(eventResponse.data?.message)) {
          console.log((eventResponse.data.message as EventData[]));
          const matchedEvent = (eventResponse.data.message as EventData[]).find((event) => event._id === id) || null;
          
          setEventData(matchedEvent);
        } else {
          setEventData(null);
        }

        const workflowResponse = await axios.post(`${backendUrl}/api/workflow/getByOrganizer`, { eventId: id });
        
        if (workflowResponse.data?.success) {
          const workflowContent = workflowResponse.data?.message?.workflow?.workFlowContent;
          setWorkflowItems(Array.isArray(workflowContent) ? workflowContent : []);
        } else {
          setWorkflowItems([]);
          toast.error(workflowResponse.data?.message || "Failed to load workflow.");
        }
      } catch (error: any) {
        toast.error(error?.message || "Failed to load event details.");
        setEventData(null);
        setWorkflowItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [backendUrl, id]);

  const approvedCount = useMemo(() => workflowItems.filter((item) => item.status === "approved").length, [workflowItems]);
  const progress = workflowItems.length > 0 ? Math.round((approvedCount / workflowItems.length) * 100) : 0;

  const workflowStatus = useMemo(() => {
    if (workflowItems.some((item) => item.status === "rejected")) return "Rejected";
    if (workflowItems.length > 0 && workflowItems.every((item) => item.status === "approved")) return "Completed";
    if (workflowItems.length > 0 && workflowItems.some((item) => item.status === "approved")) return "In Progress";
    if (workflowItems.length > 0) return "Pending";
    return "Not Started";
  }, [workflowItems]);

  return (
    <MainLayout title="Event Detail" subtitle="Real-time event and approval workflow details">
      <div className="mx-auto w-full max-w-6xl px-5 pb-16 pt-2">
        <div className="mb-4 text-xs text-slate-400">
          <Link to="/my-events" className="font-medium hover:text-blue-600">My Events</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-600">Event Detail</span>
        </div>

        {isLoading && <p className="rounded-xl border bg-white p-6 text-sm text-slate-500">Loading event and workflow...</p>}

        {!isLoading && !eventData && <p className="rounded-xl border bg-white p-6 text-sm text-red-500">Event not found.</p>}

        {!isLoading && eventData && (
          <>
            <section className="mb-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="relative h-60 w-full overflow-hidden">
                <img src={eventData.imageLink} alt={eventData.eventTitle} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <p className="inline-flex rounded-full border border-white/40 bg-white/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em]">
                    {eventData.isApproved ? "Approved Event" : "Pending Approval"}
                  </p>
                  <h1 className="mt-2 text-3xl font-semibold">{eventData.eventTitle}</h1>
                  <p className="mt-2 max-w-3xl text-sm text-white/90">{eventData.description}</p>
                </div>
              </div>
            </section>

            <div className="grid gap-5 lg:grid-cols-3">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
                <h2 className="text-xl font-semibold text-slate-900">Workflow timeline</h2>
                <p className="mt-1 text-sm text-slate-500">Status: <span className="font-semibold text-slate-700">{workflowStatus}</span></p>

                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                    <span>Progress</span>
                    <span className="font-semibold text-slate-700">{progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200">
                    <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {workflowItems.length === 0 && (
                    <p className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">No workflow records found for this event.</p>
                  )}

                  {workflowItems.map((item, index) => {
                    const approved = item.status === "approved";
                    const rejected = item.status === "rejected";
                    const pending = item.status === "pending";

                    return (
                      <article key={item._id || `${item.role}-${index}`} className="rounded-xl border border-slate-200 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {approved && <CheckCircle2 size={16} className="text-emerald-500" />}
                            {rejected && <XCircle size={16} className="text-red-500" />}
                            {pending && <Clock3 size={16} className="text-amber-500" />}
                            {!approved && !rejected && !pending && <Clock3 size={16} className="text-slate-400" />}
                            <h3 className="text-sm font-semibold text-slate-800">{formatRole(item.role)}</h3>
                          </div>

                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${
                              approved
                                ? "bg-emerald-50 text-emerald-700"
                                : rejected
                                  ? "bg-red-50 text-red-700"
                                  : pending
                                    ? "bg-amber-50 text-amber-700"
                                    : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>

                        <p className="mt-2 text-xs text-slate-500">Updated: <span className="font-medium text-slate-700">{formatDateTime(item.updatedAt)}</span></p>
                        <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">{item.message?.trim() ? item.message : "No message provided."}</p>
                      </article>
                    );
                  })}
                </div>
              </section>

              <aside className="space-y-5">
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-900">Event summary</h2>
                  <div className="mt-4 space-y-3 text-sm">
                    <p className="flex items-start gap-2 text-slate-600"><Calendar size={15} className="mt-0.5 text-blue-500" /> {formatDate(eventData.eventDate)}</p>
                    <p className="flex items-start gap-2 text-slate-600"><Clock3 size={15} className="mt-0.5 text-blue-500" /> {formatTime(eventData.startTime)} - {formatTime(eventData.endTime)}</p>
                    <p className="flex items-start gap-2 text-slate-600"><MapPin size={15} className="mt-0.5 text-blue-500" /> {eventData.venue}</p>
                    <p className="flex items-start gap-2 text-slate-600"><Users size={15} className="mt-0.5 text-blue-500" /> {eventData.expectedAttendees} attendees</p>
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-900">Quick links</h2>
                  <div className="mt-4 space-y-2">
                    <Link to="/events" className="inline-flex w-full justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                      Browse all events
                    </Link>
                    <Link to="/my-events" className="inline-flex w-full justify-center rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                      Back to my events
                    </Link>
                  </div>
                </section>
              </aside>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default EventDetail;
