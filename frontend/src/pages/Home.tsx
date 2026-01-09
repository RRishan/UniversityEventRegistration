import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import event1 from "@/assets/event-1.jpg";
import event2 from "@/assets/event-2.jpg";
import event3 from "@/assets/event-3.jpg";
import event4 from "@/assets/event-4.jpg";

const featuredEvents = [
  {
    id: "1",
    title: "Music Festival 2024",
    image: event1,
    date: "Dec 20, 2024",
    location: "Main Auditorium",
    category: "Concert"
  },
  {
    id: "2",
    title: "New Year Celebration",
    image: event2,
    date: "Dec 31, 2024",
    location: "Campus Ground",
    category: "Festival"
  },
  {
    id: "3",
    title: "Live Performance",
    image: event3,
    date: "Jan 5, 2025",
    location: "Open Theater",
    category: "Performance"
  },
  {
    id: "4",
    title: "EDM Night",
    image: event4,
    date: "Jan 10, 2025",
    location: "Student Center",
    category: "Concert"
  }
];

const Home = () => {
  return (
    <MainLayout title="Welcome to Eventraze" subtitle="Discover and manage university events">
      <div className="container mx-auto px-6 pb-12">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link to="/events" className="card-white hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">Browse Events</h3>
            <p className="text-muted-foreground">Explore upcoming university events</p>
          </Link>
          <Link to="/event-registration" className="card-white hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">Register Event</h3>
            <p className="text-muted-foreground">Submit a new event for approval</p>
          </Link>
          <Link to="/my-events" className="card-white hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">My Events</h3>
            <p className="text-muted-foreground">Track your event submissions</p>
          </Link>
        </div>

        {/* Featured Events Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Featured Events</h2>
            <Link to="/events" className="text-primary hover:underline font-medium">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredEvents.map((event) => (
              <Link
                key={event.id}
                to={`/event/${event.id}`}
                className="group bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                      {event.category}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{event.location}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-white mb-1">120+</div>
            <div className="text-white/70 text-sm">Events This Year</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-white mb-1">5,000+</div>
            <div className="text-white/70 text-sm">Attendees</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-white mb-1">50+</div>
            <div className="text-white/70 text-sm">Organizers</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-white mb-1">15</div>
            <div className="text-white/70 text-sm">Departments</div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;
