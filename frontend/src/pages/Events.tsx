import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import event1 from "@/assets/event-1.jpg";
import event2 from "@/assets/event-2.jpg";
import event3 from "@/assets/event-3.jpg";
import event4 from "@/assets/event-4.jpg";
import event5 from "@/assets/event-5.jpg";
import event6 from "@/assets/event-6.jpg";

const events = [
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
  },
  {
    id: "5",
    title: "Rock Concert",
    image: event5,
    date: "Jan 15, 2025",
    location: "Main Hall",
    category: "Concert"
  },
  {
    id: "6",
    title: "Cultural Fest",
    image: event6,
    date: "Jan 20, 2025",
    location: "University Hall",
    category: "Festival"
  }
];

const Events = () => {
  return (
    <MainLayout title="Upcoming Events" subtitle="Discover and explore university events">
      <div className="container mx-auto px-6 pb-12">
        {/* Filter/Search Section */}
        <div className="flex flex-wrap gap-4 mb-8">
          <input
            type="text"
            placeholder="Search events..."
            className="flex-1 min-w-[200px] px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <select className="px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="">All Categories</option>
            <option value="concert">Concert</option>
            <option value="festival">Festival</option>
            <option value="performance">Performance</option>
            <option value="workshop">Workshop</option>
          </select>
          <select className="px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="">All Dates</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
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
                  <span className="px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                    {event.category}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
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

        {/* Load More */}
        <div className="text-center mt-10">
          <button className="btn-primary px-8 py-3">
            Load More Events
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Events;
