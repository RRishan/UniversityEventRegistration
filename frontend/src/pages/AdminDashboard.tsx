import { useState } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, Users, Calendar, MapPin, Settings, FileText, Bell, Search } from "lucide-react";
import crowdBg from "@/assets/crowd-bg.jpg";

const AdminDashboard = () => {
  const [searchUsername, setSearchUsername] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const pendingApprovals = [
    { id: 1, username: "johndoe123", requestedRole: "Lecture", userSince: "Jan 2022", avatar: "👤" },
    { id: 2, username: "janesmith456", requestedRole: "organizer", userSince: "Feb 2022", avatar: "👤" },
    { id: 3, username: "michaelwill789", requestedRole: "Viewer", userSince: "Mar 2022", avatar: "👤" },
  ];

  const roles = ["Admin", "Editor", "Viewer"];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">EventPro Admin</h1>
            <span className="px-3 py-1 bg-foreground text-background rounded-full text-sm">
              System Administrator
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <span className="text-lg">👤</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-border min-h-[calc(100vh-73px)] p-4">
          <nav className="sidebar-nav">
            <Link to="/admin" className="sidebar-link">
              <TrendingUp className="w-5 h-5" />
              Overview
            </Link>
            <Link to="/admin/users" className="sidebar-link-active">
              <Users className="w-5 h-5" />
              Users
            </Link>
            <Link to="/admin/events" className="sidebar-link">
              <Calendar className="w-5 h-5" />
              Events
            </Link>
            <Link to="/admin/venues" className="sidebar-link">
              <MapPin className="w-5 h-5" />
              Venues
            </Link>
            <Link to="/admin/reports" className="sidebar-link">
              <FileText className="w-5 h-5" />
              Reports
            </Link>
            <Link to="/admin/settings" className="sidebar-link">
              <Settings className="w-5 h-5" />
              Settings
            </Link>
            <Link to="/admin/audit" className="sidebar-link">
              <FileText className="w-5 h-5" />
              Audit Logs
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Hero Section with Search */}
          <div 
            className="relative h-96 bg-cover bg-center"
            style={{ backgroundImage: `url(${crowdBg})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
            <div className="relative z-10 h-full flex items-center">
              <div className="container mx-auto px-6 grid grid-cols-2 gap-12">
                <div>
                  <h2 className="text-5xl font-bold text-primary-foreground mb-4">Find User</h2>
                  <p className="text-primary-foreground/80 text-lg">
                    Search for users to approve role changes.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-primary-foreground text-sm mb-2 block">Username</label>
                    <input
                      type="text"
                      placeholder="Enter username"
                      value={searchUsername}
                      onChange={(e) => setSearchUsername(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-white border-0 text-foreground"
                    />
                    <p className="text-primary-foreground/60 text-sm mt-1">
                      Search by username or email
                    </p>
                  </div>

                  <div>
                    <label className="text-primary-foreground text-sm mb-2 block">Role</label>
                    <div className="flex gap-2">
                      {roles.map((role) => (
                        <button
                          key={role}
                          onClick={() => setSelectedRole(role)}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            selectedRole === role
                              ? "bg-foreground text-background"
                              : "bg-foreground/20 text-primary-foreground hover:bg-foreground/30"
                          }`}
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                    <p className="text-primary-foreground/60 text-sm mt-1">
                      Select a role to assign
                    </p>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button className="flex-1 py-3 bg-foreground text-background rounded-lg font-medium">
                      Search
                    </button>
                    <button className="flex-1 py-3 border-2 border-primary-foreground text-primary-foreground rounded-lg font-medium">
                      Approve Role
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Approvals Section */}
          <div className="container mx-auto px-6 py-12">
            <div className="grid grid-cols-2 gap-12">
              <div>
                <h3 className="text-3xl font-bold mb-4">Pending Approvals</h3>
                <p className="text-muted-foreground mb-6">List of users awaiting approval.</p>
                
                <div className="flex gap-4">
                  <button className="px-6 py-3 border border-border rounded-lg font-medium hover:bg-muted transition-colors">
                    Reject Selected
                  </button>
                  <button className="px-6 py-3 bg-foreground text-background rounded-lg font-medium hover:bg-foreground/90 transition-colors">
                    Approve Selected
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {pendingApprovals.map((user) => (
                  <div key={user.id} className="bg-white rounded-xl p-4 border border-border flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-2xl">
                        {user.avatar}
                      </div>
                      <div>
                        <p className="font-semibold">{user.username}</p>
                        <p className="text-sm text-muted-foreground">User since {user.userSince}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">Requested Role:</p>
                      <p className="text-primary">{user.requestedRole}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
