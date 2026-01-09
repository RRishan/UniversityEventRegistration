import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Plus } from "lucide-react";

const MyEvents = () => {
  const events = [
    { id: 1, title: "Annual Company Retreat 2025", status: "In Review", date: "Mar 15-17, 2025" },
    { id: 2, title: "Tech Workshop Series", status: "Pending", date: "Feb 20, 2025" },
  ];

  return (
    <MainLayout title="My Events" subtitle="Manage your event submissions">
      <div className="container mx-auto px-6 pb-12">
        <div className="flex justify-end mb-6">
          <Link to="/event-registration" className="flex items-center gap-2 px-6 py-3 bg-primary-foreground text-primary rounded-lg font-medium">
            <Plus className="w-5 h-5" /> Create Event
          </Link>
        </div>
        <div className="space-y-4">
          {events.map((event) => (
            <Link key={event.id} to={`/event/${event.id}`} className="card-white block hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  <p className="text-muted-foreground">{event.date}</p>
                </div>
                <span className={`status-badge ${event.status === "In Review" ? "status-in-review" : "status-pending"}`}>
                  {event.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default MyEvents;
