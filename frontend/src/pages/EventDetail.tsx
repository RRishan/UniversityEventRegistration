import { Link } from "react-router-dom";
import { Check, Clock, AlertCircle, X, Download, Edit, XCircle, Calendar, MapPin, Users, ChevronDown, Search, Bell, Menu } from "lucide-react";

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

  const getStepIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return (
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <Check className="w-5 h-5 text-primary-foreground" />
          </div>
        );
      case "In Progress":
        return (
          <div className="w-10 h-10 rounded-full bg-warning flex items-center justify-center">
            <Clock className="w-5 h-5 text-warning-foreground" />
          </div>
        );
      case "Pending":
        return (
          <div className="w-10 h-10 rounded-full border-2 border-muted flex items-center justify-center">
            <Clock className="w-5 h-5 text-muted-foreground" />
          </div>
        );
      case "Skipped":
        return (
          <div className="w-10 h-10 rounded-full bg-destructive flex items-center justify-center">
            <X className="w-5 h-5 text-destructive-foreground" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-white border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Menu className="w-6 h-6 text-muted-foreground" />
            <nav className="flex items-center gap-6">
              <Link to="/my-events" className="text-foreground font-medium">Dashboard</Link>
              <Link to="/my-events" className="text-muted-foreground">My Events</Link>
              <Link to="/calendar" className="text-muted-foreground">Calendar</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">3:51 PM GMT+7</span>
            <Link to="/event-registration" className="px-4 py-2 border border-border rounded-lg font-medium">
              Create Event
            </Link>
            <Search className="w-5 h-5 text-muted-foreground" />
            <Bell className="w-5 h-5 text-muted-foreground" />
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <span className="text-lg">👤</span>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center gap-2 text-sm">
          <Link to="/my-events" className="text-muted-foreground hover:text-foreground">Dashboard</Link>
          <span className="text-muted-foreground">›</span>
          <Link to="/my-events" className="text-muted-foreground hover:text-foreground">My Events</Link>
          <span className="text-muted-foreground">›</span>
          <span className="font-medium">{event.title}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 pb-12">
        {/* Event Header Card */}
        <div className="bg-white rounded-2xl p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center text-xl font-bold">
                {event.id}
              </div>
              <div>
                <h1 className="text-2xl font-semibold">{event.title}</h1>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    Organized by {event.organizer}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Submitted on {event.submittedDate}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-info/10 text-info rounded-full text-sm">
              <Clock className="w-4 h-4" />
              {event.status}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Approval Workflow */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-6">Approval Workflow</h2>
            
            <div className="space-y-0">
              {event.steps.map((step, index) => (
                <div key={step.id} className="approval-workflow-step">
                  <div className="absolute left-0 top-0">
                    {getStepIcon(step.status)}
                  </div>
                  
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold flex items-center gap-2">
                        Step {step.id}: {step.title}
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          step.status === "Completed" ? "bg-muted text-muted-foreground" :
                          step.status === "In Progress" ? "border border-foreground" :
                          step.status === "Pending" ? "border border-muted-foreground text-muted-foreground" :
                          "bg-muted text-muted-foreground"
                        }`}>
                          {step.status}
                        </span>
                      </h3>
                      
                      {step.approver && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <Users className="w-4 h-4" />
                          Approved by {step.approver}
                        </p>
                      )}
                      {step.assignee && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <Users className="w-4 h-4" />
                          Assigned to {step.assignee}
                        </p>
                      )}
                      {step.approvedAt && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Approved on {step.approvedAt}
                        </p>
                      )}
                      {step.pendingSince && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Pending since {step.pendingSince}
                        </p>
                      )}
                      {step.note && step.status !== "Skipped" && (
                        <div className="mt-2 p-3 bg-muted rounded-lg">
                          <p className="text-sm flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            {step.status === "In Progress" ? "Awaiting Review" : step.note}
                          </p>
                          {step.status === "In Progress" && (
                            <p className="text-sm text-muted-foreground mt-1">{step.note}</p>
                          )}
                        </div>
                      )}
                      {step.reason && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <AlertCircle className="w-4 h-4" />
                          Reason: {step.reason}
                        </p>
                      )}
                    </div>
                  </div>

                  <button className="text-sm text-muted-foreground flex items-center gap-1 hover:text-foreground">
                    <ChevronDown className="w-4 h-4" />
                    View Comments & Feedback
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-primary text-primary-foreground rounded-2xl p-6">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full py-2 bg-primary-foreground text-primary rounded-lg font-medium flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Download Approval Document
                </button>
                <button className="w-full py-2 bg-white/20 rounded-lg font-medium flex items-center justify-center gap-2">
                  <Edit className="w-4 h-4" />
                  Edit Event
                </button>
                <button className="w-full py-2 bg-white/20 rounded-lg font-medium flex items-center justify-center gap-2">
                  <XCircle className="w-4 h-4" />
                  Cancel Event
                </button>
              </div>
            </div>

            {/* Event Summary */}
            <div className="bg-white rounded-2xl p-6">
              <h3 className="font-semibold mb-4">Event Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Event Date:</span>
                  <span className="font-medium">{event.eventDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-medium">{event.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expected Attendees:</span>
                  <span className="font-medium">{event.expectedAttendees} people</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium">Step {event.currentStep} of {event.steps.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comments & Feedback History */}
        <div className="bg-white rounded-2xl p-6 mt-6">
          <h2 className="text-xl font-semibold mb-6">Comments & Feedback History</h2>
          
          <div className="space-y-4">
            {event.comments.map((comment, idx) => (
              <div key={idx} className="bg-muted/30 rounded-xl p-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-xl">👤</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold">{comment.author}</span>
                        <span className="text-sm text-muted-foreground ml-2">{comment.role}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{comment.date}</span>
                    </div>
                    {comment.status && (
                      <span className="inline-block px-2 py-0.5 bg-muted rounded text-xs mt-1">
                        {comment.status}
                      </span>
                    )}
                    <p className="mt-2 text-muted-foreground">{comment.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-border py-6">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            © 2025 Event Management System. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/help" className="text-sm text-muted-foreground hover:text-foreground">
              Help Center
            </Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EventDetail;
