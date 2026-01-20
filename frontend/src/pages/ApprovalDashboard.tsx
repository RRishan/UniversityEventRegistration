import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Calendar, Eye, MessageCircle, X, Check, AlertTriangle, Clock, Download, FileText, ChevronLeft, ChevronRight, Settings, LogOut } from "lucide-react";
import crowdBg from "@/assets/crowd-bg.jpg";
import axios from "axios";
import { AppContext } from "@/context/AppContext";
import { toast } from "sonner";

const ApprovalDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState<typeof events[0] | null>(null);
  const [comment, setComment] = useState("");
  const navigate = useNavigate();

  const events = [
    {
      id: 1,
      title: "Annual Research Symposium 2025",
      organizer: "Dr. Nayana",
      submissionDate: "Dec 28, 2024",
      status: "Overdue",
      dueDate: "Jan 15, 2025",
      eventDate: "March 15-17, 2025",
      location: "University Conference Center",
      expectedAttendees: 250,
      description: "Annual symposium showcasing faculty and graduate student research across all departments. Features keynote speakers, poster sessions, and networking opportunities.",
      documents: ["Event_Proposal.pdf"],
      comments: [
        { author: "Dr. Sarah Mitchell", role: "Dean of Faculty", time: "2 days ago", text: "Please provide more details on the catering arrangements and accessibility accommodations." },
        { author: "Dr. James Wilson", role: "", time: "1 day ago", text: "Updated documentation has been attached with the requested information." },
        { author: "Prof. Michael Torres", role: "", time: "5 hours ago", text: "Budget seems reasonable for this scale of event." },
      ]
    },
    {
      id: 2,
      title: "Spring Career Fair 2025",
      organizer: "Prof. Emily Chen",
      submissionDate: "Jan 02, 2025",
      status: "Pending",
      eventDate: "April 5, 2025",
      location: "Main Hall",
      expectedAttendees: 500,
      description: "Annual career fair connecting students with employers.",
      documents: [],
      comments: []
    },
    {
      id: 3,
      title: "Guest Lecture Series: AI Ethics",
      organizer: "Dr. Michael Brown",
      submissionDate: "Jan 03, 2025",
      status: "Pending",
      eventDate: "Feb 20, 2025",
      location: "Lecture Hall B",
      expectedAttendees: 150,
      description: "Guest lecture on ethical considerations in AI development.",
      documents: [],
      comments: []
    },
    {
      id: 4,
      title: "Student Innovation Workshop",
      organizer: "Lisa Anderson",
      submissionDate: "Dec 20, 2024",
      status: "Overdue",
      dueDate: "Jan 10, 2025",
      eventDate: "March 1, 2025",
      location: "Innovation Lab",
      expectedAttendees: 75,
      description: "Workshop on innovation and entrepreneurship for students.",
      documents: [],
      comments: []
    },
    {
      id: 5,
      title: "Department Fundraiser Gala",
      organizer: "Prof. Robert Martinez",
      submissionDate: "Jan 04, 2025",
      status: "Pending",
      eventDate: "May 10, 2025",
      location: "Grand Ballroom",
      expectedAttendees: 300,
      description: "Annual fundraising gala for department scholarships.",
      documents: [],
      comments: []
    },
    {
      id: 6,
      title: "Graduate Student Orientation",
      organizer: "Dr. Amanda Lee",
      submissionDate: "Jan 05, 2025",
      status: "In Review",
      eventDate: "Aug 25, 2025",
      location: "Student Center",
      expectedAttendees: 200,
      description: "Orientation program for new graduate students.",
      documents: [],
      comments: []
    },
  ];

  const statusCounts = {
    pending: 8,
    inReview: 3,
    completed: 0,
    overdue: 2,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return <span className="status-badge status-pending">{status}</span>;
      case "Approved":
        return <span className="status-badge status-approved">{status}</span>;
      case "Overdue":
        return <span className="status-badge status-overdue">{status}</span>;
      case "In Review":
        return <span className="status-badge status-in-review">{status}</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  const {backendUrl, setIsLoggedIn} = useContext(AppContext);

  const handleLogout = async  (e: React.FormEvent) => {
    try {
      e.preventDefault();

      const {data} = await axios.post(backendUrl + "/api/auth/logout");

      if (data.success) {
        toast.success("Logout successful!");
        setIsLoggedIn(false);
        navigate("/sign-in");
      }else {
        toast.error(data.message);
      }
      

    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
    
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-border p-4 z-40">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground">📋</span>
          </div>
          <div>
            <h1 className="font-semibold text-foreground">Event Portal</h1>
            <p className="text-xs text-muted-foreground">Approval System</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className="sidebar-link-active w-full text-left">
            <Clock className="w-5 h-5" />
            <span>Pending</span>
            <span className="ml-auto bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
              {statusCounts.pending}
            </span>
          </button>
          <button className="sidebar-link w-full text-left">
            <Eye className="w-5 h-5" />
            <span>In Review</span>
            <span className="ml-auto bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
              {statusCounts.inReview}
            </span>
          </button>
          <button className="sidebar-link w-full text-left">
            <Check className="w-5 h-5" />
            <span>Completed</span>
          </button>
          <button className="sidebar-link w-full text-left">
            <AlertTriangle className="w-5 h-5" />
            <span>Overdue</span>
            <span className="ml-auto bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-full">
              {statusCounts.overdue}
            </span>
          </button>
          <button className="sidebar-link w-full text-left">
            <Clock className="w-5 h-5" />
            <span>My History</span>
          </button>
        </nav>

        {/* User Info */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <span className="text-lg">👤</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Dr. Sarah Mitchell</p>
            <p className="text-xs text-muted-foreground">Dean of Faculty</p>
          </div>
          <Settings className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <header className="bg-white border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">Approval Dashboard</h1>
            <span className="px-3 py-1 bg-muted rounded-full text-sm">Dean of Faculty</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm">
              2
            </div>
            <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
          </div>
        </header>

        {/* Filters */}
        <div className="p-4 bg-white border-b border-border">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by organizer name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-select w-40"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-review">In Review</option>
              <option value="overdue">Overdue</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg">
              <Calendar className="w-4 h-4" />
              Date Range
            </button>
            <button className="text-muted-foreground hover:text-foreground">
              Reset Filters
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 flex gap-4">
          {/* Events Table */}
          <div className="flex-1 bg-white rounded-lg border border-border overflow-hidden relative">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-20"
              style={{ backgroundImage: `url(${crowdBg})` }}
            />
            <div className="relative">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="p-3 text-left">
                      <input type="checkbox" className="rounded border-border" />
                    </th>
                    <th className="p-3 text-left text-xs font-semibold uppercase text-muted-foreground">Event Title</th>
                    <th className="p-3 text-left text-xs font-semibold uppercase text-muted-foreground">Organizer Name</th>
                    <th className="p-3 text-left text-xs font-semibold uppercase text-muted-foreground">Submission Date</th>
                    <th className="p-3 text-left text-xs font-semibold uppercase text-muted-foreground">Status</th>
                    <th className="p-3 text-left text-xs font-semibold uppercase text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr 
                      key={event.id} 
                      className="border-t border-border hover:bg-muted/30 cursor-pointer"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <td className="p-3">
                        <input type="checkbox" className="rounded border-border" onClick={(e) => e.stopPropagation()} />
                      </td>
                      <td className="p-3">
                        <div>
                          <p className="font-medium">{event.title}</p>
                          {event.dueDate && (
                            <p className="text-xs text-destructive flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              Due: {event.dueDate}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs">
                            👤
                          </div>
                          {event.organizer}
                        </div>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">{event.submissionDate}</td>
                      <td className="p-3">{getStatusBadge(event.status)}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <button className="p-1 hover:bg-muted rounded">
                            <Eye className="w-4 h-4 text-muted-foreground" />
                          </button>
                          <button className="p-1 hover:bg-muted rounded">
                            <MessageCircle className="w-4 h-4 text-muted-foreground" />
                          </button>
                          <button className="p-1 hover:bg-muted rounded">
                            <Check className="w-4 h-4 text-success" />
                          </button>
                          <button className="p-1 hover:bg-muted rounded">
                            <X className="w-4 h-4 text-destructive" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="p-4 border-t border-border flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Showing 6 of 13 events</p>
                <div className="flex items-center gap-2">
                  <button className="w-8 h-8 flex items-center justify-center border border-border rounded">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center bg-foreground text-background rounded">1</button>
                  <button className="w-8 h-8 flex items-center justify-center border border-border rounded">2</button>
                  <button className="w-8 h-8 flex items-center justify-center border border-border rounded">3</button>
                  <button className="w-8 h-8 flex items-center justify-center border border-border rounded">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Event Details Panel */}
          {selectedEvent && (
            <div className="w-96 bg-white rounded-lg border border-border p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Event Details</h3>
                <button onClick={() => setSelectedEvent(null)}>
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Event Info Card */}
              <div className="bg-primary text-primary-foreground rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{selectedEvent.title}</h4>
                </div>
                {getStatusBadge(selectedEvent.status)}
                <div className="space-y-1 text-sm">
                  <p className="flex items-center gap-2">
                    <span>👤</span> {selectedEvent.organizer}
                  </p>
                  <p className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> {selectedEvent.eventDate}
                  </p>
                  <p className="flex items-center gap-2">
                    <span>📍</span> {selectedEvent.location}
                  </p>
                  <p className="flex items-center gap-2">
                    <span>👥</span> Expected: {selectedEvent.expectedAttendees} attendees
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>
              </div>

              {/* Documents */}
              {selectedEvent.documents.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Attached Documents</h4>
                  {selectedEvent.documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-muted rounded">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{doc}</span>
                      </div>
                      <Download className="w-4 h-4 text-muted-foreground cursor-pointer" />
                    </div>
                  ))}
                </div>
              )}

              {/* Comments */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Comments</h4>
                  <span className="text-xs text-muted-foreground">{selectedEvent.comments.length} comments</span>
                </div>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {selectedEvent.comments.map((comment, idx) => (
                    <div key={idx} className="bg-muted/50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{comment.author}</span>
                        <span className="text-xs text-muted-foreground">{comment.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{comment.text}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="form-input flex-1"
                  />
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm">
                    Send
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4 border-t border-border">
                <button className="w-full py-2 bg-foreground text-background rounded-lg font-medium flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" /> Approve
                </button>
                <button className="w-full py-2 border border-border rounded-lg font-medium flex items-center justify-center gap-2">
                  <X className="w-4 h-4" /> Reject
                </button>
                <button className="w-full py-2 border border-border rounded-lg font-medium flex items-center justify-center gap-2">
                  ✏️ Request Revision
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApprovalDashboard;
