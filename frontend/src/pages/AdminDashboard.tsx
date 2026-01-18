import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TrendingUp, Users, Calendar, MapPin, Settings, FileText, Bell, Search, BarChart3, CheckCircle, XCircle, User } from "lucide-react";
import crowdBg from "@/assets/crowd-bg.jpg";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const chartData = [
  { name: "Jan", events: 12, users: 45 },
  { name: "Feb", events: 19, users: 52 },
  { name: "Mar", events: 15, users: 61 },
  { name: "Apr", events: 25, users: 78 },
  { name: "May", events: 22, users: 85 },
  { name: "Jun", events: 30, users: 95 },
];

const recentEvents = [
  { id: 1, name: "Tech Conference 2025", status: "approved", date: "Jan 15, 2025", organizer: "John Doe" },
  { id: 2, name: "Music Festival", status: "pending", date: "Jan 20, 2025", organizer: "Jane Smith" },
  { id: 3, name: "Workshop Series", status: "rejected", date: "Jan 25, 2025", organizer: "Mike Wilson" },
  { id: 4, name: "Cultural Night", status: "approved", date: "Feb 1, 2025", organizer: "Sarah Lee" },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [searchUsername, setSearchUsername] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const pendingApprovals = [
    { id: 1, username: "johndoe123", requestedRole: "Lecturer", userSince: "Jan 2022", avatar: "👤" },
    { id: 2, username: "janesmith456", requestedRole: "Organizer", userSince: "Feb 2022", avatar: "👤" },
    { id: 3, username: "michaelwill789", requestedRole: "Viewer", userSince: "Mar 2022", avatar: "👤" },
  ];

  const roles = ["Admin", "Editor", "Viewer"];

  const stats = [
    { label: "Total Events", value: "156", icon: Calendar, color: "bg-blue-500" },
    { label: "Active Users", value: "1,234", icon: Users, color: "bg-green-500" },
    { label: "Pending Approvals", value: "23", icon: Bell, color: "bg-yellow-500" },
    { label: "Venues", value: "45", icon: MapPin, color: "bg-purple-500" },
  ];

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/home" className="text-xl font-bold text-primary">Eventraze Admin</Link>
            <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm">
              System Administrator
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">3</span>
            </button>
            <button 
              onClick={handleProfileClick}
              className="w-10 h-10 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors cursor-pointer"
            >
              <User className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-border min-h-[calc(100vh-73px)] p-4 sticky top-[73px]">
          <nav className="space-y-1">
            {[
              { icon: TrendingUp, label: "Overview", id: "overview" },
              { icon: Users, label: "Users", id: "users" },
              { icon: Calendar, label: "Events", id: "events" },
              { icon: MapPin, label: "Venues", id: "venues" },
              { icon: FileText, label: "Reports", id: "reports" },
              { icon: Settings, label: "Settings", id: "settings" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-border/50">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-green-500 text-sm font-medium">+12%</span>
                </div>
                <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-border/50">
              <h3 className="text-lg font-semibold mb-4">Events Overview</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip />
                  <Line type="monotone" dataKey="events" stroke="#4F46E5" strokeWidth={3} dot={{ fill: "#4F46E5" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-border/50">
              <h3 className="text-lg font-semibold mb-4">User Growth</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip />
                  <Bar dataKey="users" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Events Table */}
          <div className="bg-white rounded-2xl shadow-lg border border-border/50 overflow-hidden mb-8">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-semibold">Recent Events</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Event Name</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Organizer</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentEvents.map((event) => (
                    <tr key={event.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-foreground">{event.name}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{event.organizer}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{event.date}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                          event.status === "approved" ? "bg-green-100 text-green-700" :
                          event.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {event.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button className="p-2 hover:bg-green-100 rounded-lg transition-colors">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </button>
                          <button className="p-2 hover:bg-red-100 rounded-lg transition-colors">
                            <XCircle className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pending Role Approvals */}
          <div className="bg-white rounded-2xl shadow-lg border border-border/50 p-6">
            <h3 className="text-lg font-semibold mb-6">Pending Role Approvals</h3>
            <div className="space-y-4">
              {pendingApprovals.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                      {user.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{user.username}</p>
                      <p className="text-sm text-muted-foreground">User since {user.userSince}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Requested Role</p>
                      <p className="font-medium text-primary">{user.requestedRole}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors">
                        Approve
                      </button>
                      <button className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;