import { useMemo, useState, type ReactNode } from "react";
import {
  Activity,
  ArrowUpRight,
  Clock3,
  Filter,
  LayoutDashboard,
  Layers3,
  MapPin,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  School,
  Sparkles,
  Trash2,
  UsersRound,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

type TabKey = "overview" | "venues" | "faculties" | "organizations" | "dean";
type RecordMode = "create" | "edit";
type RecordType = "venue" | "faculty" | "organization" | "dean";

type Venue = {
  id: string;
  name: string;
  campus: string;
  capacity: number;
  type: string;
  status: "Available" | "Reserved" | "Maintenance";
  notes: string;
};

type Faculty = {
  id: string;
  name: string;
  dean: string;
  departments: string[];
  status: "Active" | "Review";
  notes: string;
};

type Organization = {
  id: string;
  name: string;
  faculty: string;
  lead: string;
  email: string;
  status: "Active" | "Pending" | "Suspended";
  notes: string;
};

type ActivityItem = {
  id: string;
  title: string;
  detail: string;
  time: string;
};

const seedVenues: Venue[] = [
  {
    id: "V-101",
    name: "Bandaranayake Hall",
    campus: "Main Campus",
    capacity: 850,
    type: "Auditorium",
    status: "Available",
    notes: "Best for conferences, stage events, and major student gatherings.",
  },
  {
    id: "V-102",
    name: "Faculty Open Courtyard",
    campus: "Faculty of Computing",
    capacity: 260,
    type: "Outdoor",
    status: "Reserved",
    notes: "Used for cultural evenings and exhibition launches.",
  },
  {
    id: "V-103",
    name: "Innovation Lab Amphitheater",
    campus: "Engineering Block",
    capacity: 180,
    type: "Seminar Space",
    status: "Maintenance",
    notes: "Audio system upgrade scheduled for this week.",
  },
];

const seedFaculties: Faculty[] = [
  {
    id: "F-01",
    name: "Faculty of Computing",
    dean: "Prof. N. Perera",
    departments: ["Software Engineering", "Information Systems", "Data Science"],
    status: "Active",
    notes: "Highest event volume this semester.",
  },
  {
    id: "F-02",
    name: "Faculty of Business",
    dean: "Dr. A. Fernando",
    departments: ["Marketing", "Finance", "Human Resources"],
    status: "Active",
    notes: "Strong industry partnership pipeline.",
  },
  {
    id: "F-03",
    name: "Faculty of Arts",
    dean: "Prof. K. Silva",
    departments: ["Languages", "History", "Media Studies"],
    status: "Review",
    notes: "Pending academic calendar confirmation.",
  },
];

const seedOrganizations: Organization[] = [
  {
    id: "O-11",
    name: "Tech Society",
    faculty: "Faculty of Computing",
    lead: "Malik Jayasuriya",
    email: "techsociety@uni.lk",
    status: "Active",
    notes: "Runs hackathons and developer meetups.",
  },
  {
    id: "O-12",
    name: "Business Circle",
    faculty: "Faculty of Business",
    lead: "Dilini Wijesinghe",
    email: "businesscircle@uni.lk",
    status: "Pending",
    notes: "Awaiting advisor approval and logo upload.",
  },
  {
    id: "O-13",
    name: "Arts Collective",
    faculty: "Faculty of Arts",
    lead: "Chamodi Rathnayake",
    email: "artscollective@uni.lk",
    status: "Suspended",
    notes: "Membership verification required.",
  },
];

const seedDeans = [
  {
    id: "D-01",
    name: "Prof. N. Perera",
    faculty: "Faculty of Computing",
    lead: "N/A",
    email: "",
    notes: "Oversees all computing-related academic and event activities.",
  },
  {
    id: "D-02",
    name: "Dr. A. Fernando",
    faculty: "Faculty of Business",
    lead: "N/A",
    email: "",
    notes: "Responsible for business faculty operations and student organization oversight.",
  },
  {
    id: "D-03",
    name: "Prof. K. Silva",
    faculty: "Faculty of Arts",
    lead: "N/A",
    email: "",
    notes: "Currently under review for event scheduling and faculty coordination.",
  },
];

const statusStyles: Record<string, string> = {
  Available: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Reserved: "bg-amber-50 text-amber-700 border-amber-200",
  Maintenance: "bg-rose-50 text-rose-700 border-rose-200",
  Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Review: "bg-sky-50 text-sky-700 border-sky-200",
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Suspended: "bg-rose-50 text-rose-700 border-rose-200",
};

const formatTimestamp = () =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date());

const createId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [venues, setVenues] = useState(seedVenues);
  const [faculties, setFaculties] = useState(seedFaculties);
  const [organizations, setOrganizations] = useState(seedOrganizations);
  const [deans, setDeans] = useState(seedDeans);
  const [activity, setActivity] = useState<ActivityItem[]>([
    {
      id: "a1",
      title: "Dashboard ready",
      detail: "Admin experience refreshed with a more polished, campus-inspired system layout.",
      time: "Just now",
    },
  ]);

  const [editor, setEditor] = useState<{
    open: boolean;
    type: RecordType;
    mode: RecordMode;
    id?: string;
  }>({ open: false, type: "venue", mode: "create" });

  const [venueDraft, setVenueDraft] = useState({
    name: "",
    campus: "",
    capacity: "",
    type: "",
    status: "Available" as Venue["status"],
    notes: "",
  });

  const [facultyDraft, setFacultyDraft] = useState({
    name: "",
    dean: "",
    departments: "",
    status: "Active" as Faculty["status"],
    notes: "",
  });

  const [organizationDraft, setOrganizationDraft] = useState({
    name: "",
    faculty: "",
    lead: "",
    email: "",
    status: "Active" as Organization["status"],
    notes: "",
  });

  const [deanDraft, setDeanDraft] = useState({
    name: "",
    faculty: "",
    lead: "",
    email: "",
    status: "Active" as Organization["status"],
    notes: "",
  });

  const stats = useMemo(() => {
    const availableVenues = venues.filter((venue) => venue.status === "Available").length;
    const activeFaculties = faculties.filter((faculty) => faculty.status === "Active").length;
    const activeOrgs = organizations.filter((organization) => organization.status === "Active").length;
    const pendingOrgs = organizations.filter((organization) => organization.status === "Pending").length;

    return [
      {
        label: "Venues Managed",
        value: venues.length,
        helper: `${availableVenues} ready for booking`,
        icon: MapPin,
        accent: "from-sky-500 to-cyan-400",
      },
      {
        label: "Faculties Indexed",
        value: faculties.length,
        helper: `${activeFaculties} active academic units`,
        icon: School,
        accent: "from-indigo-500 to-violet-400",
      },
      {
        label: "Organizations Live",
        value: activeOrgs,
        helper: `${pendingOrgs} waiting for approval`,
        icon: UsersRound,
        accent: "from-emerald-500 to-lime-400",
      },
      {
        label: "System Signals",
        value: activity.length,
        helper: "Recent admin actions",
        icon: Activity,
        accent: "from-amber-500 to-orange-400",
      },
    ];
  }, [activity.length, faculties, organizations, venues]);

  const filteredVenues = useMemo(
    () =>
      venues.filter(
        (venue) =>
          [venue.name, venue.campus, venue.type, venue.status, venue.notes]
            .join(" ")
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
      ),
    [searchQuery, venues],
  );

  const filteredFaculties = useMemo(
    () =>
      faculties.filter(
        (faculty) =>
          [faculty.name, faculty.dean, faculty.departments.join(" "), faculty.status, faculty.notes]
            .join(" ")
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
      ),
    [faculties, searchQuery],
  );

  const filteredOrganizations = useMemo(
    () =>
      organizations.filter(
        (organization) =>
          [organization.name, organization.faculty, organization.lead, organization.email, organization.status, organization.notes]
            .join(" ")
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
      ),
    [organizations, searchQuery],
  );

  const filteredDeans = useMemo(
    () =>
      deans.filter(
        (dean) =>
          [dean.name, dean.faculty, dean.lead, dean.email, dean.notes]
            .join(" ")
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
      ),
    [deans, searchQuery],
  );

  const openCreateDialog = (type: RecordType) => {
    setEditor({ open: true, type, mode: "create" });

    if (type === "venue") {
      setVenueDraft({
        name: "",
        campus: "",
        capacity: "",
        type: "",
        status: "Available",
        notes: "",
      });
    }

    if (type === "faculty") {
      setFacultyDraft({
        name: "",
        dean: "",
        departments: "",
        status: "Active",
        notes: "",
      });
    }

    if (type === "organization") {
      setOrganizationDraft({
        name: "",
        faculty: faculties[0]?.name ?? "",
        lead: "",
        email: "",
        status: "Active",
        notes: "",
      });
    }

    if (type === "dean") {
      setDeanDraft({
        name: "",
        faculty: faculties[0]?.name ?? "",
        lead: "",
        email: "",
        status: "Active",
        notes: "",
      });
    }
  };

  const openEditDialog = (type: RecordType, id: string) => {
    setEditor({ open: true, type, mode: "edit", id });

    if (type === "venue") {
      const venue = venues.find((item) => item.id === id);
      if (!venue) return;
      setVenueDraft({
        name: venue.name,
        campus: venue.campus,
        capacity: venue.capacity.toString(),
        type: venue.type,
        status: venue.status,
        notes: venue.notes,
      });
    }

    if (type === "faculty") {
      const faculty = faculties.find((item) => item.id === id);
      if (!faculty) return;
      setFacultyDraft({
        name: faculty.name,
        dean: faculty.dean,
        departments: faculty.departments.join(", "),
        status: faculty.status,
        notes: faculty.notes,
      });
    }

    if (type === "organization") {
      const organization = organizations.find((item) => item.id === id);
      if (!organization) return;
      setOrganizationDraft({
        name: organization.name,
        faculty: organization.faculty,
        lead: organization.lead,
        email: organization.email,
        status: organization.status,
        notes: organization.notes,
      });
    }

    if (type === "dean") {
      const dean = deans.find((item) => item.id === id);
      if (!dean) return;
      setDeanDraft({
        name: dean.name,
        faculty: dean.faculty,
        lead: dean.lead,
        email: dean.email,
        status: 'Active',
        notes: dean.notes,
      });
    }
  };

  const closeEditor = () => setEditor({ open: false, type: "venue", mode: "create" });

  const pushActivity = (title: string, detail: string) => {
    setActivity((current) => [
      { id: createId("A"), title, detail, time: formatTimestamp() },
      ...current.slice(0, 5),
    ]);
  };

  const handleSave = () => {
    if (editor.type === "venue") {
      const capacity = Number(venueDraft.capacity);
      if (!venueDraft.name.trim() || !venueDraft.campus.trim() || !venueDraft.type.trim() || Number.isNaN(capacity)) {
        toast({
          title: "Venue details are incomplete",
          description: "Please fill in the venue name, campus, type, and a valid capacity.",
        });
        return;
      }

      const payload: Venue = {
        id: editor.mode === "create" ? createId("V") : editor.id ?? createId("V"),
        name: venueDraft.name.trim(),
        campus: venueDraft.campus.trim(),
        capacity,
        type: venueDraft.type.trim(),
        status: venueDraft.status,
        notes: venueDraft.notes.trim(),
      };

      setVenues((current) =>
        editor.mode === "create"
          ? [payload, ...current]
          : current.map((item) => (item.id === editor.id ? payload : item)),
      );
      pushActivity(
        editor.mode === "create" ? "Venue created" : "Venue updated",
        `${payload.name} is now marked as ${payload.status.toLowerCase()}.`,
      );
      toast({
        title: editor.mode === "create" ? "Venue added" : "Venue updated",
        description: `${payload.name} was saved successfully.`,
      });
    }

    if (editor.type === "faculty") {
      if (!facultyDraft.name.trim() || !facultyDraft.dean.trim() || !facultyDraft.departments.trim()) {
        toast({
          title: "Faculty details are incomplete",
          description: "Please include the faculty name, dean, and at least one department.",
        });
        return;
      }

      const payload: Faculty = {
        id: editor.mode === "create" ? createId("F") : editor.id ?? createId("F"),
        name: facultyDraft.name.trim(),
        dean: facultyDraft.dean.trim(),
        departments: facultyDraft.departments
          .split(",")
          .map((department) => department.trim())
          .filter(Boolean),
        status: facultyDraft.status,
        notes: facultyDraft.notes.trim(),
      };

      setFaculties((current) =>
        editor.mode === "create"
          ? [payload, ...current]
          : current.map((item) => (item.id === editor.id ? payload : item)),
      );
      pushActivity(
        editor.mode === "create" ? "Faculty created" : "Faculty updated",
        `${payload.name} now manages ${payload.departments.length} department(s).`,
      );
      toast({
        title: editor.mode === "create" ? "Faculty added" : "Faculty updated",
        description: `${payload.name} was saved successfully.`,
      });
    }

    if (editor.type === "organization") {
      if (!organizationDraft.name.trim() || !organizationDraft.faculty.trim() || !organizationDraft.lead.trim() || !organizationDraft.email.trim()) {
        toast({
          title: "Organization details are incomplete",
          description: "Please fill in the organization name, faculty, lead, and email.",
        });
        return;
      }

      const payload: Organization = {
        id: editor.mode === "create" ? createId("O") : editor.id ?? createId("O"),
        name: organizationDraft.name.trim(),
        faculty: organizationDraft.faculty.trim(),
        lead: organizationDraft.lead.trim(),
        email: organizationDraft.email.trim(),
        status: organizationDraft.status,
        notes: organizationDraft.notes.trim(),
      };

      setOrganizations((current) =>
        editor.mode === "create"
          ? [payload, ...current]
          : current.map((item) => (item.id === editor.id ? payload : item)),
      );
      pushActivity(
        editor.mode === "create" ? "Organization created" : "Organization updated",
        `${payload.name} is currently ${payload.status.toLowerCase()}.`,
      );
      toast({
        title: editor.mode === "create" ? "Organization added" : "Organization updated",
        description: `${payload.name} was saved successfully.`,
      });
    }

    closeEditor();
  };

  const removeRecord = (type: RecordType, id: string) => {
    const confirmMessage =
      type === "venue"
        ? "Delete this venue?"
        : type === "faculty"
          ? "Delete this faculty?"
          : "Delete this organization?";

    if (!window.confirm(confirmMessage)) return;

    if (type === "venue") {
      const deleted = venues.find((item) => item.id === id);
      setVenues((current) => current.filter((item) => item.id !== id));
      pushActivity("Venue deleted", `${deleted?.name ?? "A venue"} was removed from the catalog.`);
    }

    if (type === "faculty") {
      const deleted = faculties.find((item) => item.id === id);
      setFaculties((current) => current.filter((item) => item.id !== id));
      pushActivity("Faculty deleted", `${deleted?.name ?? "A faculty"} was removed from the catalog.`);
    }

    if (type === "organization") {
      const deleted = organizations.find((item) => item.id === id);
      setOrganizations((current) => current.filter((item) => item.id !== id));
      pushActivity("Organization deleted", `${deleted?.name ?? "An organization"} was removed from the catalog.`);
    }
    if (type === "dean") {
      const deleted = deans.find((item) => item.id === id);
      setDeans((current) => current.filter((item) => item.id !== id));
      pushActivity("Dean deleted", `${deleted?.name ?? "A dean"} was removed from the catalog.`);
    }

    toast({
      title: "Record deleted",
      description: "The selected item was removed from the dashboard.",
    });
  };

  const renderBadge = (value: string) => (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-semibold",
        statusStyles[value] ?? "bg-slate-50 text-slate-700 border-slate-200",
      )}
    >
      {value}
    </Badge>
  );

  const managementTabs = [
    { id: "overview" as const, label: "Overview", icon: LayoutDashboard },
    { id: "venues" as const, label: "Venues", icon: MapPin },
    { id: "faculties" as const, label: "Faculties", icon: School },
    { id: "organizations" as const, label: "Organizations", icon: UsersRound },
    { id: "dean" as const, label: "Dean", icon: UsersRound }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(99,102,241,0.14),_transparent_26%),linear-gradient(180deg,_#f8fbff_0%,_#eef4ff_100%)]" />
      <div className="absolute inset-0 opacity-[0.03] [background-image:radial-gradient(#0f172a_1px,transparent_1px)] [background-size:22px_22px]" />
      
      <div className="relative z-10">
        {/* Header */}
        <Header />

        <main className="mx-auto grid max-w-full gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-8">
          <aside className="glass-card fade-in-up rounded-3xl border border-white/70 p-4 shadow-[0_16px_60px_rgba(37,99,235,0.08)]">
            <div className="mb-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-white shadow-lg">
              <p className="text-xs uppercase tracking-[0.22em] text-white/60">System Snapshot</p>
              <h2 className="mt-2 text-2xl font-semibold">Campus admin</h2>
              <p className="mt-2 text-sm text-white/75">
                Manage venues, faculties, and organizations from one refined dashboard.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-white/70">
                <Clock3 className="h-4 w-4" />
                Updated {formatTimestamp()}
              </div>
            </div>

            <nav className="space-y-2">
              {managementTabs.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition-all",
                      active
                        ? "bg-slate-900 text-white shadow-lg shadow-slate-900/15"
                        : "bg-white/75 text-slate-600 hover:bg-sky-50 hover:text-sky-700",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-xl",
                        active ? "bg-white/10" : "bg-slate-100",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="mt-6 rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 to-indigo-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <ShieldCheck className="h-4 w-4 text-sky-600" />
                Admin note
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                This dashboard is currently running with local CRUD state. It is ready to connect to backend
                endpoints when you want persistence.
              </p>
            </div>
          </aside>

          <section className="space-y-6">
            <div className="glass-card fade-in-up rounded-3xl border border-white/70 p-6 shadow-[0_16px_60px_rgba(37,99,235,0.08)]">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                
                <div className="max-w-2xl">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">
                    Admin dashboard design study
                  </p>
                  <h2 className="mt-3 font-display text-4xl font-semibold leading-tight text-slate-900">
                    A more polished control room for campus operations.
                  </h2>
                  <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                    The layout favors a premium glass look, strong hierarchy, and direct CRUD actions for the
                    three data areas you asked for: venues, faculties, and organizations.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <div
                        key={stat.label}
                        className="rounded-2xl border border-white/80 bg-white/90 p-4 shadow-sm"
                      >
                        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.accent} text-white shadow-lg`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <p className="mt-4 text-3xl font-semibold text-slate-900">{stat.value}</p>
                        <p className="mt-1 text-sm font-medium text-slate-500">{stat.label}</p>
                        <p className="mt-2 text-xs leading-5 text-slate-500">{stat.helper}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="glass-card fade-in-up rounded-3xl border border-white/70 p-4 shadow-[0_16px_60px_rgba(37,99,235,0.08)]">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
                    <Filter className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Quick filters</p>
                    <p className="text-sm text-slate-500">Search across all records with one input.</p>
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-3 lg:max-w-2xl lg:flex-row">
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Search venues, faculties, or organizations..."
                      className="h-11 rounded-2xl border-white/80 bg-white/90 pl-10 shadow-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="h-11 rounded-2xl px-4">
                      Reset view
                    </Button>
                    <Button
                      className="btn-primary relative h-11 overflow-hidden rounded-2xl px-4"
                      onClick={() =>
                        openCreateDialog(
                          activeTab === "faculties" ? "faculty" : activeTab === "organizations" ? "organization" : "venue",
                        )
                      }
                    >
                      <span className="shine-bar" />
                      <span className="relative z-10 flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add record
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {activeTab === "overview" && (
              <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
                <div className="glass-card fade-in-up rounded-3xl border border-white/70 p-6 shadow-[0_16px_60px_rgba(37,99,235,0.08)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-600">
                        Operations board
                      </p>
                      <h3 className="mt-2 text-2xl font-semibold text-slate-900">What the dashboard controls</h3>
                    </div>
                    <Badge variant="outline" className="rounded-full border-sky-200 bg-sky-50 px-3 py-1 text-sky-700">
                      Live demo mode
                    </Badge>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-3">
                    {[
                      {
                        title: "Venue planning",
                        icon: MapPin,
                        detail: "Track availability, capacity, and maintenance states.",
                      },
                      {
                        title: "Faculty records",
                        icon: School,
                        detail: "Maintain dean assignments and department lists.",
                      },
                      {
                        title: "Organization access",
                        icon: UsersRound,
                        detail: "Approve, suspend, and review student organizations.",
                      },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                            <Icon className="h-4 w-4" />
                          </div>
                          <h4 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h4>
                          <p className="mt-2 text-sm leading-6 text-slate-600">{item.detail}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="glass-card fade-in-up rounded-3xl border border-white/70 p-6 shadow-[0_16px_60px_rgba(37,99,235,0.08)]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-500 text-white">
                      <Layers3 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">Recent activity</h3>
                      <p className="text-sm text-slate-500">A compact log of dashboard actions.</p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    {activity.map((item) => (
                      <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-semibold text-slate-900">{item.title}</p>
                            <p className="mt-1 text-sm leading-6 text-slate-600">{item.detail}</p>
                          </div>
                          <span className="text-xs font-medium text-slate-400">{item.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "venues" && (
              <div className="glass-card fade-in-up rounded-3xl border border-white/70 p-6 shadow-[0_16px_60px_rgba(37,99,235,0.08)]">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-600">Venues</p>
                    <h3 className="mt-2 text-2xl font-semibold text-slate-900">Venue catalog management</h3>
                  </div>
                  <Button className="btn-primary relative overflow-hidden rounded-2xl" onClick={() => openCreateDialog("venue")}>
                    <span className="shine-bar" />
                    <span className="relative z-10 flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add venue
                    </span>
                  </Button>
                </div>

                <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead>Venue</TableHead>
                        <TableHead>Campus</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredVenues.map((venue) => (
                        <TableRow key={venue.id}>
                          <TableCell>
                            <div className="font-semibold text-slate-900">{venue.name}</div>
                            <div className="mt-1 text-sm text-slate-500">{venue.notes}</div>
                          </TableCell>
                          <TableCell className="text-slate-600">{venue.campus}</TableCell>
                          <TableCell className="text-slate-600">{venue.capacity}</TableCell>
                          <TableCell className="text-slate-600">{venue.type}</TableCell>
                          <TableCell>{renderBadge(venue.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="inline-flex gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 rounded-xl"
                                onClick={() => openEditDialog("venue", venue.id)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 rounded-xl text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                                onClick={() => removeRecord("venue", venue.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredVenues.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="py-10 text-center text-slate-500">
                            No venues matched your search.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {activeTab === "faculties" && (
              <div className="glass-card fade-in-up rounded-3xl border border-white/70 p-6 shadow-[0_16px_60px_rgba(37,99,235,0.08)]">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-600">Faculties</p>
                    <h3 className="mt-2 text-2xl font-semibold text-slate-900">Faculty structure and department control</h3>
                  </div>
                  <Button className="btn-primary relative overflow-hidden rounded-2xl" onClick={() => openCreateDialog("faculty")}>
                    <span className="shine-bar" />
                    <span className="relative z-10 flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add faculty
                    </span>
                  </Button>
                </div>

                <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead>Faculty</TableHead>
                        <TableHead>Dean</TableHead>
                        <TableHead>Departments</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredFaculties.map((faculty) => (
                        <TableRow key={faculty.id}>
                          <TableCell>
                            <div className="font-semibold text-slate-900">{faculty.name}</div>
                            <div className="mt-1 text-sm text-slate-500">{faculty.notes}</div>
                          </TableCell>
                          <TableCell className="text-slate-600">{faculty.dean}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-2">
                              {faculty.departments.map((department) => (
                                <Badge
                                  key={department}
                                  variant="outline"
                                  className="rounded-full border-slate-200 bg-slate-50 text-slate-600"
                                >
                                  {department}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>{renderBadge(faculty.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="inline-flex gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 rounded-xl"
                                onClick={() => openEditDialog("faculty", faculty.id)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 rounded-xl text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                                onClick={() => removeRecord("faculty", faculty.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredFaculties.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="py-10 text-center text-slate-500">
                            No faculties matched your search.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {activeTab === "organizations" && (
              <div className="glass-card fade-in-up rounded-3xl border border-white/70 p-6 shadow-[0_16px_60px_rgba(37,99,235,0.08)]">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600">
                      Organizations
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold text-slate-900">Organization access and visibility</h3>
                  </div>
                  <Button className="btn-primary relative overflow-hidden rounded-2xl" onClick={() => openCreateDialog("organization")}>
                    <span className="shine-bar" />
                    <span className="relative z-10 flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add organization
                    </span>
                  </Button>
                </div>

                <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead>Organization</TableHead>
                        <TableHead>Faculty</TableHead>
                        <TableHead>Lead</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrganizations.map((organization) => (
                        <TableRow key={organization.id}>
                          <TableCell>
                            <div className="font-semibold text-slate-900">{organization.name}</div>
                            <div className="mt-1 text-sm text-slate-500">{organization.notes}</div>
                          </TableCell>
                          <TableCell className="text-slate-600">{organization.faculty}</TableCell>
                          <TableCell className="text-slate-600">{organization.lead}</TableCell>
                          <TableCell className="text-slate-600">{organization.email}</TableCell>
                          <TableCell>{renderBadge(organization.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="inline-flex gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 rounded-xl"
                                onClick={() => openEditDialog("organization", organization.id)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 rounded-xl text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                                onClick={() => removeRecord("organization", organization.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredOrganizations.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="py-10 text-center text-slate-500">
                            No organizations matched your search.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
            { activeTab === 'dean' && (
                <div className="glass-card fade-in-up rounded-3xl border border-white/70 p-6 shadow-[0_16px_60px_rgba(37,99,235,0.08)]">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600">
                      Organizations
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold text-slate-900">Dean access and visibility</h3>
                  </div>
                  <Button className="btn-primary relative overflow-hidden rounded-2xl" onClick={() => openCreateDialog("dean")}>
                    <span className="shine-bar" />
                    <span className="relative z-10 flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add Dean
                    </span>
                  </Button>
                </div>

                <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Faculity</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDeans.map((dean) => (
                        <TableRow key={dean.id}>
                          <TableCell>
                            <div className="font-semibold text-slate-900">{dean.name}</div>
                            <div className="mt-1 text-sm text-slate-500">{dean.notes}</div>
                          </TableCell>
                          <TableCell className="text-slate-600">{dean.faculty}</TableCell>
                          <TableCell className="text-slate-600">{dean.lead}</TableCell>
                          <TableCell className="text-slate-600">{dean.email}</TableCell>
                          <TableCell className="text-right">
                            <div className="inline-flex gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 rounded-xl"
                                onClick={() => openEditDialog("dean", dean.id)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 rounded-xl text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                                onClick={() => removeRecord("dean", dean.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredDeans.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="py-10 text-center text-slate-500">
                            No deans matched your search.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
              )
            }
          </section>
        </main>

        <Footer />
      </div>

      <Dialog open={editor.open} onOpenChange={(open) => (open ? setEditor((current) => ({ ...current, open })) : closeEditor())}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-3xl border border-white/70 bg-white/95 p-0 shadow-2xl backdrop-blur-xl">
          <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-sky-50 p-6">
            <DialogHeader className="text-left">
              <DialogTitle className="text-2xl text-slate-900">
                {editor.mode === "create" ? "Add new" : "Edit"}{" "}
                {editor.type === "venue" ? "venue" : editor.type === "faculty" ? "faculty" : editor.type === "dean" ? "dean" : "organization"  }
              </DialogTitle>
              <DialogDescription className="mt-2 text-sm text-slate-600">
                Update the record details below, then save the change to the dashboard state.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="space-y-6 p-6">
            {editor.type === "venue" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Venue name">
                  <Input
                    value={venueDraft.name}
                    onChange={(event) => setVenueDraft((current) => ({ ...current, name: event.target.value }))}
                    placeholder="Bandaranayake Hall"
                  />
                </Field>
                <Field label="Campus">
                  <Input
                    value={venueDraft.campus}
                    onChange={(event) => setVenueDraft((current) => ({ ...current, campus: event.target.value }))}
                    placeholder="Main Campus"
                  />
                </Field>
                <Field label="Capacity">
                  <Input
                    type="number"
                    value={venueDraft.capacity}
                    onChange={(event) => setVenueDraft((current) => ({ ...current, capacity: event.target.value }))}
                    placeholder="250"
                  />
                </Field>
                <Field label="Venue type">
                  <Input
                    value={venueDraft.type}
                    onChange={(event) => setVenueDraft((current) => ({ ...current, type: event.target.value }))}
                    placeholder="Auditorium"
                  />
                </Field>
                <Field label="Status">
                  <Select
                    value={venueDraft.status}
                    onValueChange={(value) => setVenueDraft((current) => ({ ...current, status: value as Venue["status"] }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Reserved">Reserved</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Notes">
                    <Textarea
                      value={venueDraft.notes}
                      onChange={(event) => setVenueDraft((current) => ({ ...current, notes: event.target.value }))}
                      placeholder="Add any booking notes or restrictions..."
                      className="min-h-28"
                    />
                  </Field>
                </div>
              </div>
            )}

            {editor.type === "faculty" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Faculty name">
                  <Input
                    value={facultyDraft.name}
                    onChange={(event) => setFacultyDraft((current) => ({ ...current, name: event.target.value }))}
                    placeholder="Faculty of Computing"
                  />
                </Field>
                <Field label="Dean">
                  <Input
                    value={facultyDraft.dean}
                    onChange={(event) => setFacultyDraft((current) => ({ ...current, dean: event.target.value }))}
                    placeholder="Prof. N. Perera"
                  />
                </Field>
                <Field label="Departments">
                  <Input
                    value={facultyDraft.departments}
                    onChange={(event) => setFacultyDraft((current) => ({ ...current, departments: event.target.value }))}
                    placeholder="Software Engineering, Data Science"
                  />
                </Field>
                <Field label="Status">
                  <Select
                    value={facultyDraft.status}
                    onValueChange={(value) => setFacultyDraft((current) => ({ ...current, status: value as Faculty["status"] }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Review">Review</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Notes">
                    <Textarea
                      value={facultyDraft.notes}
                      onChange={(event) => setFacultyDraft((current) => ({ ...current, notes: event.target.value }))}
                      placeholder="Context about current academic or event activity..."
                      className="min-h-28"
                    />
                  </Field>
                </div>
              </div>
            )}

            {editor.type === "organization" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Organization name">
                  <Input
                    value={organizationDraft.name}
                    onChange={(event) => setOrganizationDraft((current) => ({ ...current, name: event.target.value }))}
                    placeholder="Tech Society"
                  />
                </Field>
                <Field label="Faculty">
                  <Input
                    value={organizationDraft.faculty}
                    onChange={(event) => setOrganizationDraft((current) => ({ ...current, faculty: event.target.value }))}
                    placeholder="Faculty of Computing"
                  />
                </Field>
                <Field label="Lead">
                  <Input
                    value={organizationDraft.lead}
                    onChange={(event) => setOrganizationDraft((current) => ({ ...current, lead: event.target.value }))}
                    placeholder="Malik Jayasuriya"
                  />
                </Field>
                <Field label="Email">
                  <Input
                    value={organizationDraft.email}
                    onChange={(event) => setOrganizationDraft((current) => ({ ...current, email: event.target.value }))}
                    placeholder="techsociety@uni.lk"
                  />
                </Field>
                <Field label="Status">
                  <Select
                    value={organizationDraft.status}
                    onValueChange={(value) =>
                      setOrganizationDraft((current) => ({ ...current, status: value as Organization["status"] }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Notes">
                    <Textarea
                      value={organizationDraft.notes}
                      onChange={(event) =>
                        setOrganizationDraft((current) => ({ ...current, notes: event.target.value }))
                      }
                      placeholder="Short status or admin note..."
                      className="min-h-28"
                    />
                  </Field>
                </div>
              </div>
            )}
            {
              editor.type === "dean" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Dean name">
                    <Input
                      value={deanDraft.name}
                      onChange={(event) => setDeanDraft((current) => ({ ...current, name: event.target.value }))}
                      placeholder="Prof. N. Perera"
                    />
                  </Field>
                  <Field label="Faculty">
                    <Input
                      value={deanDraft.faculty}
                      onChange={(event) => setDeanDraft((current) => ({ ...current, faculty: event.target.value }))}
                      placeholder="Faculty of Computing"
                    />
                  </Field>
                  <Field label="Lead">
                    <Input
                      value={deanDraft.lead}
                      onChange={(event) => setDeanDraft((current) => ({ ...current, lead: event.target.value }))}
                      placeholder="N/A"
                    />
                  </Field>
                  <Field label="Email">
                    <Input
                      value={deanDraft.email}
                      onChange={(event) => setDeanDraft((current) => ({ ...current, email: event.target.value }))}
                      placeholder="dean@uni.lk"
                    />
                  </Field>
                </div>
              )}
            </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50/80 p-6 sm:flex-row sm:justify-end">
            <Button variant="outline" className="rounded-2xl px-5" onClick={closeEditor}>
              Cancel
            </Button>
            <Button className="btn-primary relative overflow-hidden rounded-2xl px-5" onClick={handleSave}>
              <span className="shine-bar" />
              <span className="relative z-10 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Save changes
              </span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Field = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <div className="space-y-2">
    <Label className="text-sm font-semibold text-slate-700">{label}</Label>
    {children}
  </div>
);

export default AdminDashboard;
