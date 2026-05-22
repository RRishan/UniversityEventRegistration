import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, FileUp, Plus, RefreshCcw, Send, ShieldCheck, XCircle } from "lucide-react";
import { toast } from "sonner";
import { AppContext } from "@/context/AppContext";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useContext } from "react";

type Project = {
  _id: string;
  projectName: string;
  description: string;
  organization: {
    _id: string;
    organizationName: string;
    organizationType: string;
  };
  organizationAuthorityType: string;
  president: {
    _id: string;
    fullName: string;
    email: string;
  };
};

type EventItem = {
  _id: string;
  title: string;
  description: string;
  category: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  venueName: string;
  approvalStage: string;
  status: string;
  requiresSecurity: boolean;
  coverImageUrl?: string;
};

type WorkflowItem = {
  _id: string;
  currentStage: string;
  currentRole: string;
  currentAssignee?: string;
  status: string;
  event: EventItem & {
    project?: { projectName?: string };
    organization?: { organizationName?: string };
    president?: { fullName?: string; email?: string };
    venue?: { venueName?: string; ownerType?: string };
  };
};

type ProfileResponse = {
  adminProfile?: {
    organization?: string;
    faculty?: string;
    role?: string;
  };
  fullName?: string;
  email?: string;
};

type FileLike = File | null;

const roleLabel: Record<string, string> = {
  welfareOfficer: "Welfare Officer",
  advisor: "Advisor",
  dean: "Dean",
  president: "President",
  proctor: "Proctor",
  viceChancellor: "Vice Chancellor",
  chairmanOfArt: "Chairman of Art",
  sportsDirector: "Sports Director",
};

const stageLabel: Record<string, string> = {
  organizationAuthority: "Organization authority",
  welfareOfficer: "Welfare officer",
  venueOwner: "Venue owner",
  categoryCheck: "Category review",
  securityUpload: "Security upload",
  proctor: "Proctor",
  viceChancellor: "Vice Chancellor",
  welfareFinal: "Welfare final sign-off",
  approved: "Approved",
  returnedToPresident: "Returned to president",
};

const toDataUrl = (file: FileLike) =>
  new Promise<string>((resolve, reject) => {
    if (!file) {
      reject(new Error("No file selected"));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Unable to read file"));
    reader.readAsDataURL(file);
  });

const Workspace = () => {
  const navigate = useNavigate();
  const { userData } = useContext(AppContext);
  const role = userData?.role || "student";

  const [projects, setProjects] = useState<Project[]>([]);
  const [myEvents, setMyEvents] = useState<EventItem[]>([]);
  const [queue, setQueue] = useState<WorkflowItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowItem | null>(null);
  const [actionComment, setActionComment] = useState("");
  const [profile, setProfile] = useState<ProfileResponse | null>(null);

  const [projectForm, setProjectForm] = useState({
    organizationId: "",
    projectName: "",
    description: "",
    presidentName: "",
    presidentEmail: "",
    presidentPassword: "",
  });

  const [eventForm, setEventForm] = useState({
    projectId: "",
    title: "",
    description: "",
    category: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    expectedAttendees: "",
    venueName: "",
    classroomName: "",
    coverImageUrl: "",
  });

  const [securityFile, setSecurityFile] = useState<FileLike>(null);

  const canCreateProject = role === "advisor" || role === "dean";
  const canApprove = ["advisor", "dean", "welfareOfficer", "sportsDirector", "chairmanOfArt", "proctor", "viceChancellor"].includes(role);
  const canCreateEvent = role === "president";

  const loadData = async () => {
    try {
      setLoading(true);
      const [projectRes, eventRes, queueRes] = await Promise.allSettled([
        api.get("/api/project/list"),
        api.get("/api/event/mine"),
        api.get("/api/workflow/queue"),
      ]);

      if (projectRes.status === "fulfilled" && projectRes.value.data?.success) {
        setProjects(projectRes.value.data.message || []);
      }

      if (eventRes.status === "fulfilled" && eventRes.value.data?.success) {
        setMyEvents(eventRes.value.data.message || []);
      }

      if (queueRes.status === "fulfilled" && queueRes.value.data?.success) {
        const nextQueue = queueRes.value.data.message || [];
        setQueue(nextQueue);
        if (Array.isArray(nextQueue) && nextQueue.length > 0) {
          setSelectedWorkflow((current) => current && nextQueue.some((item: WorkflowItem) => item._id === current._id) ? current : nextQueue[0]);
        } else {
          setSelectedWorkflow(null);
        }
      }

      const profileRes = await api.get("/api/user/profile");
      if (profileRes.data?.success) {
        setProfile(profileRes.data.message || profileRes.data.user || null);
        const organizationId = profileRes.data.message?.adminProfile?.organization || profileRes.data.user?.adminProfile?.organization;
        if (organizationId) {
          setProjectForm((current) => ({ ...current, organizationId }));
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userData) return;
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?.role]);

  const projectLookup = useMemo(
    () => projects.map((project) => ({
      value: project._id,
      label: `${project.projectName} - ${project.organization?.organizationName || "Organization"}`,
    })),
    [projects],
  );

  const createProject = async () => {
    try {
      const payload = {
        ...projectForm,
      };
      const { data } = await api.post("/api/project/create", payload);
      if (!data?.success) {
        toast.error(data?.message || "Unable to create project");
        return;
      }

      toast.success("Project and president created");
      setProjectForm({
        organizationId: "",
        projectName: "",
        description: "",
        presidentName: "",
        presidentEmail: "",
        presidentPassword: "",
      });
      await loadData();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Unable to create project");
    }
  };

  const createEvent = async () => {
    try {
      const { data } = await api.post("/api/event/create", {
        ...eventForm,
        expectedAttendees: Number(eventForm.expectedAttendees),
      });

      if (!data?.success) {
        toast.error(data?.message || "Unable to create event");
        return;
      }

      toast.success("Event submitted to workflow");
      setEventForm({
        projectId: "",
        title: "",
        description: "",
        category: "",
        eventDate: "",
        startTime: "",
        endTime: "",
        expectedAttendees: "",
        venueName: "",
        classroomName: "",
        coverImageUrl: "",
      });
      await loadData();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Unable to create event");
    }
  };

  const resubmitEvent = async (eventId: string) => {
    try {
      const event = myEvents.find((item) => item._id === eventId);
      if (!event) return;
      const { data } = await api.post("/api/event/resubmit", {
        eventId,
        ...event,
      });

      if (!data?.success) {
        toast.error(data?.message || "Unable to resubmit event");
        return;
      }

      toast.success("Event resubmitted");
      await loadData();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Unable to resubmit event");
    }
  };

  const sendDecision = async (decision: "approved" | "rejected") => {
    if (!selectedWorkflow) return;

    if (decision === "rejected" && !actionComment.trim()) {
      toast.error("Add a short reason for rejection");
      return;
    }

    try {
      const { data } = await api.post("/api/workflow/decision", {
        eventId: selectedWorkflow.event._id,
        status: decision,
        comment: actionComment,
      });

      if (!data?.success) {
        toast.error(data?.message || "Unable to update workflow");
        return;
      }

      toast.success(decision === "approved" ? "Approved" : "Returned to president");
      setActionComment("");
      await loadData();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Unable to update workflow");
    }
  };

  const uploadSecurity = async () => {
    if (!selectedWorkflow) return;

    try {
      const imageUrl = await toDataUrl(securityFile);
      const { data } = await api.post("/api/workflow/security-upload", {
        eventId: selectedWorkflow.event._id,
        imageUrl,
      });

      if (!data?.success) {
        toast.error(data?.message || "Unable to submit security proof");
        return;
      }

      toast.success("Security proof uploaded");
      setSecurityFile(null);
      await loadData();
    } catch (error: any) {
      toast.error(error?.message || "Unable to submit security proof");
    }
  };

  const selectedEvent = selectedWorkflow?.event;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">
              {roleLabel[role] || "User"} workspace
            </p>
            <h1 className="mt-2 text-3xl font-semibold">
              {role === "welfareOfficer"
                ? "System administration and master data"
                : role === "president"
                  ? "Project events and your submissions"
                  : canApprove
                    ? "Approval queue"
                    : "University workspace"}
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
              {role === "welfareOfficer"
                ? "Create faculties, deans, venues, organizations, and university-level roles."
                : role === "president"
                  ? "Create events from your assigned project and watch the workflow move step by step."
                  : "Review events, approve or reject, and keep the workflow moving to the next stage."}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" className="rounded-full bg-white/10 text-white hover:bg-white/20" onClick={() => navigate("/")}>
              Public site
            </Button>
            <Button className="rounded-full bg-sky-500 text-white hover:bg-sky-400" onClick={loadData}>
              <RefreshCcw className="mr-2 h-4 w-4" /> Refresh
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            {canCreateProject && (
              <Card className="border-white/10 bg-white/5 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5 text-sky-300" />
                    Create project and president
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    Advisors and deans create a project, then provision the president account.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Organization</Label>
                    <Input
                      value={projectForm.organizationId}
                      onChange={(event) => setProjectForm((current) => ({ ...current, organizationId: event.target.value }))}
                      placeholder="Paste organization id"
                      className="bg-white/10 text-white placeholder:text-slate-400"
                    />
                    <p className="text-xs text-slate-400">
                      {profile?.adminProfile?.organization
                        ? "Auto-filled from your profile. You can keep it as-is."
                        : "If it is not auto-filled, paste the organization id from the admin panel."}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Project name</Label>
                    <Input
                      value={projectForm.projectName}
                      onChange={(event) => setProjectForm((current) => ({ ...current, projectName: event.target.value }))}
                      placeholder="Skill Up Project"
                      className="bg-white/10 text-white placeholder:text-slate-400"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={projectForm.description}
                      onChange={(event) => setProjectForm((current) => ({ ...current, description: event.target.value }))}
                      placeholder="What is the project about?"
                      className="min-h-28 bg-white/10 text-white placeholder:text-slate-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>President name</Label>
                    <Input
                      value={projectForm.presidentName}
                      onChange={(event) => setProjectForm((current) => ({ ...current, presidentName: event.target.value }))}
                      placeholder="Nimal Perera"
                      className="bg-white/10 text-white placeholder:text-slate-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>President email</Label>
                    <Input
                      type="email"
                      value={projectForm.presidentEmail}
                      onChange={(event) => setProjectForm((current) => ({ ...current, presidentEmail: event.target.value }))}
                      placeholder="president@uni.lk"
                      className="bg-white/10 text-white placeholder:text-slate-400"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label>Temporary password</Label>
                    <Input
                      type="text"
                      value={projectForm.presidentPassword}
                      onChange={(event) => setProjectForm((current) => ({ ...current, presidentPassword: event.target.value }))}
                      placeholder="Admin@12345"
                      className="bg-white/10 text-white placeholder:text-slate-400"
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end">
                    <Button className="rounded-2xl bg-sky-500 text-white hover:bg-sky-400" onClick={createProject}>
                      Create project
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {canCreateEvent && (
              <Card className="border-white/10 bg-white/5 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5 text-sky-300" />
                    Create event
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    Presidents submit an event under an assigned project.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2 space-y-2">
                    <Label>Project</Label>
                    <Select value={eventForm.projectId} onValueChange={(value) => setEventForm((current) => ({ ...current, projectId: value }))}>
                      <SelectTrigger className="bg-white/10 text-white">
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        {projectLookup.map((project) => (
                          <SelectItem key={project.value} value={project.value}>
                            {project.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={eventForm.title}
                      onChange={(event) => setEventForm((current) => ({ ...current, title: event.target.value }))}
                      className="bg-white/10 text-white placeholder:text-slate-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={eventForm.category} onValueChange={(value) => setEventForm((current) => ({ ...current, category: value }))}>
                      <SelectTrigger className="bg-white/10 text-white">
                        <SelectValue placeholder="Choose category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Music">Music / Arts / Cultural</SelectItem>
                        <SelectItem value="Arts">Arts</SelectItem>
                        <SelectItem value="Cultural">Cultural</SelectItem>
                        <SelectItem value="Sports">Sports</SelectItem>
                        <SelectItem value="Other">Other / Normal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={eventForm.description}
                      onChange={(event) => setEventForm((current) => ({ ...current, description: event.target.value }))}
                      className="min-h-28 bg-white/10 text-white placeholder:text-slate-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={eventForm.eventDate}
                      onChange={(event) => setEventForm((current) => ({ ...current, eventDate: event.target.value }))}
                      className="bg-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Expected attendees</Label>
                    <Input
                      type="number"
                      value={eventForm.expectedAttendees}
                      onChange={(event) => setEventForm((current) => ({ ...current, expectedAttendees: event.target.value }))}
                      className="bg-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Start time</Label>
                    <Input
                      type="time"
                      value={eventForm.startTime}
                      onChange={(event) => setEventForm((current) => ({ ...current, startTime: event.target.value }))}
                      className="bg-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End time</Label>
                    <Input
                      type="time"
                      value={eventForm.endTime}
                      onChange={(event) => setEventForm((current) => ({ ...current, endTime: event.target.value }))}
                      className="bg-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Venue name</Label>
                    <Input
                      value={eventForm.venueName}
                      onChange={(event) => setEventForm((current) => ({ ...current, venueName: event.target.value }))}
                      className="bg-white/10 text-white placeholder:text-slate-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Classroom</Label>
                    <Input
                      value={eventForm.classroomName}
                      onChange={(event) => setEventForm((current) => ({ ...current, classroomName: event.target.value }))}
                      className="bg-white/10 text-white placeholder:text-slate-400"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label>Cover image URL</Label>
                    <Input
                      value={eventForm.coverImageUrl}
                      onChange={(event) => setEventForm((current) => ({ ...current, coverImageUrl: event.target.value }))}
                      placeholder="https://..."
                      className="bg-white/10 text-white placeholder:text-slate-400"
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end">
                    <Button className="rounded-2xl bg-sky-500 text-white hover:bg-sky-400" onClick={createEvent}>
                      Submit event
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {canApprove && (
              <Card className="border-white/10 bg-white/5 text-white">
                <CardHeader>
                  <CardTitle>Pending approvals</CardTitle>
                  <CardDescription className="text-slate-300">
                    Events waiting for your current role.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {queue.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
                      No pending items for your role.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {queue.map((workflow) => (
                        <button
                          key={workflow._id}
                          onClick={() => setSelectedWorkflow(workflow)}
                          className={`w-full rounded-2xl border p-4 text-left transition ${
                            selectedWorkflow?._id === workflow._id
                              ? "border-sky-400/50 bg-sky-400/10"
                              : "border-white/10 bg-white/5 hover:bg-white/10"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold">{workflow.event.title}</p>
                              <p className="mt-1 text-xs text-slate-300">
                                {workflow.event.project?.projectName || "Project"} - {workflow.event.organization?.organizationName || "Organization"}
                              </p>
                            </div>
                            <Badge className="rounded-full bg-white/10 text-slate-100">{stageLabel[workflow.currentStage] || workflow.currentStage}</Badge>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {canCreateEvent && (
              <Card className="border-white/10 bg-white/5 text-white">
                <CardHeader>
                  <CardTitle>Your events</CardTitle>
                  <CardDescription className="text-slate-300">
                    Resubmit returned events or upload security proof when required.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {myEvents.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
                      No events created yet.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {myEvents.map((event) => (
                        <div key={event._id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-semibold">{event.title}</p>
                              <p className="mt-1 text-xs text-slate-300">
                                {event.venueName} - {event.eventDate} - {event.startTime} to {event.endTime}
                              </p>
                              <div className="mt-3 flex flex-wrap gap-2">
                                <Badge className="rounded-full bg-white/10 text-slate-100">{event.status}</Badge>
                                <Badge className="rounded-full bg-white/10 text-slate-100">{stageLabel[event.approvalStage] || event.approvalStage}</Badge>
                                {event.requiresSecurity && (
                                  <Badge className="rounded-full bg-amber-400/15 text-amber-200">
                                    Security needed
                                  </Badge>
                                )}
                              </div>
                            </div>
                            {event.status === "returned" && (
                              <Button className="rounded-2xl bg-sky-500 text-white hover:bg-sky-400" onClick={() => resubmitEvent(event._id)}>
                                Resubmit
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            {selectedWorkflow && (
              <Card className="border-white/10 bg-white/5 text-white">
                <CardHeader>
                  <CardTitle>Selected event</CardTitle>
                  <CardDescription className="text-slate-300">
                    {selectedWorkflow.event.title}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-sky-300">Current stage</p>
                    <p className="mt-2 text-lg font-semibold">{stageLabel[selectedWorkflow.currentStage] || selectedWorkflow.currentStage}</p>
                    <p className="mt-1 text-sm text-slate-300">
                      Role: {roleLabel[selectedWorkflow.currentRole] || selectedWorkflow.currentRole}
                    </p>
                  </div>

                  <div className="grid gap-2 text-sm text-slate-300">
                    <div>Organization: {selectedWorkflow.event.organization?.organizationName || "-"}</div>
                    <div>Project: {selectedWorkflow.event.project?.projectName || "-"}</div>
                    <div>Venue: {selectedWorkflow.event.venue?.venueName || selectedWorkflow.event.venueName}</div>
                  </div>

                  {selectedWorkflow.currentStage === "securityUpload" && role === "president" && (
                    <div className="space-y-3 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4">
                      <div className="flex items-center gap-2 text-amber-100">
                        <ShieldCheck className="h-4 w-4" />
                        Upload the signature image before the event can move forward.
                      </div>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(event) => setSecurityFile(event.target.files?.[0] || null)}
                        className="bg-white/10 text-white"
                      />
                      <Button className="w-full rounded-2xl bg-amber-500 text-slate-950 hover:bg-amber-400" onClick={uploadSecurity}>
                        <FileUp className="mr-2 h-4 w-4" /> Submit security proof
                      </Button>
                    </div>
                  )}

                  {canApprove && selectedWorkflow.currentStage !== "securityUpload" && (
                    <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                      <Label>Comment</Label>
                      <Textarea
                        value={actionComment}
                        onChange={(event) => setActionComment(event.target.value)}
                        placeholder="Add a short note..."
                        className="min-h-24 bg-white/10 text-white placeholder:text-slate-400"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <Button className="rounded-2xl bg-emerald-500 text-white hover:bg-emerald-400" onClick={() => sendDecision("approved")}>
                          <CheckCircle2 className="mr-2 h-4 w-4" /> Approve
                        </Button>
                        <Button variant="destructive" className="rounded-2xl" onClick={() => sendDecision("rejected")}>
                          <XCircle className="mr-2 h-4 w-4" /> Reject
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Card className="border-white/10 bg-white/5 text-white">
              <CardHeader>
                <CardTitle>Quick summary</CardTitle>
                <CardDescription className="text-slate-300">
                  What the system sees right now.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-300">
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <span>Projects</span>
                  <span className="font-semibold text-white">{projects.length}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <span>My events</span>
                  <span className="font-semibold text-white">{myEvents.length}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <span>Pending queue</span>
                  <span className="font-semibold text-white">{queue.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workspace;
