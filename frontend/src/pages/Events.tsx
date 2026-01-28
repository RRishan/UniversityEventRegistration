import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import axios from "axios";
import { AppContext } from "@/context/AppContext";
import { toast } from "@/components/ui/sonner";

const Events = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [allEvents, setAllEvents] = useState([]);

  const filteredEvents = allEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || event.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const {backendUrl} = useContext(AppContext);

  const getAllEvents = async () => {
    try {
      
      axios.defaults.withCredentials = true;

      const {data} = await axios.get(backendUrl + '/api/event/events');

      if (data.success) {
        const formattedEvents = data.message.map((event: any) => ({
          id: event._id,
          title: event.eventTitle,
          image: event.imageLink,
          date: event.eventDate,
          location: event.venue,
          category: event.category.charAt(0).toUpperCase() + event.category.slice(1),
          status: 'Approved'
        }));

        setAllEvents(formattedEvents);
      }else {
        toast.error(data.message);
      }


    } catch (error) {
      toast.error(error.message);
    }
  }


  useEffect(() => {
    getAllEvents();
  }, []);

  const getStatusBadge = (status: string) => {
    const styles = {
      approved: "bg-green-100 text-green-700 border-green-200",
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      rejected: "bg-red-100 text-red-700 border-red-200"
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  return (
    <MainLayout title="Upcoming Events" subtitle="Discover and explore university events">
      <div className="container mx-auto px-6 pb-12">
        {/* Filter/Search Section */}
        <div className="flex flex-wrap gap-4 mb-8">
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 min-w-[200px] px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          >
            <option value="">All Categories</option>
            <option value="concert">Concert</option>
            <option value="festival">Festival</option>
            <option value="performance">Performance</option>
            <option value="workshop">Workshop</option>
          </select>
          <select 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          >
            <option value="">All Dates</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="group bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-border/50"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full shadow-lg">
                    {event.category}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full border capitalize ${getStatusBadge(event.status)}`}>
                    {event.status}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {event.title}
                </h3>
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{event.location}</span>
                </div>
                <div className="flex gap-3">
                  <Link
                    to={`/event/${event.id}`}
                    className="flex-1 text-center py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    View Details
                  </Link>
                  <button className="flex-1 py-2.5 border border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary/10 transition-colors">
                    Register
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-10">
          <button className="px-8 py-3 bg-foreground text-background rounded-xl font-medium hover:bg-foreground/90 transition-colors">
            Load More Events
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Events;