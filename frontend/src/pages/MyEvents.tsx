import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Plus, Eye, Edit, X, Calendar, MapPin } from "lucide-react";
import uploaded1 from "@/assets/uploaded-1.jpg";
import uploaded3 from "@/assets/uploaded-3.jpg";
import uploaded4 from "@/assets/uploaded-4.jpg";
import { toast } from "sonner";
import axios from "axios";
import { AppContext } from "@/context/AppContext";

const MyEvents = () => {
  const [filter, setFilter] = useState("all");
  const [myEvents, setMyEvents] = useState([
  { 
    id: 1, 
    title: "Annual Company Retreat 2025", 
    status: "In Review", 
    date: "Mar 15-17, 2025",
    location: "Main Auditorium",
    image: uploaded1,
    attendees: 150
  },
  { 
    id: 2, 
    title: "Tech Workshop Series", 
    status: "Pending", 
    date: "Feb 20, 2025",
    location: "Conference Hall A",
    image: uploaded3,
    attendees: 75
  },
  { 
    id: 3, 
    title: "Cultural Night 2025", 
    status: "Approved", 
    date: "Apr 10, 2025",
    location: "Open Theater",
    image: uploaded4,
    attendees: 300
  },
  ]);

  const {backendUrl} = useContext(AppContext);

  const getAllEvents = async () => {
    try {
      
      axios.defaults.withCredentials = true;

      const {data} = await axios.get(backendUrl + '/api/event/organization-events');
      console.log(data);
      if (data.success) {
        
        console.log(data.message);
        const formattedEvents = data.message.map((event: any) => ({
          id: event._id,
          title: event.eventTitle,
          image: event.imageLink,
          date: event.eventDate,
          location: event.venue,
          status: event.isApproved,
          attendance: event.expectedAttendees
        }))

        setMyEvents(formattedEvents);
      }else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    
    getAllEvents();
  }, [])

  const filteredEvents = myEvents.filter(event => {
    if (filter === "all") return true;
    return event.status.toLowerCase().includes(filter.toLowerCase());
  });

  const getStatusStyle = (status: string) => {
    // switch (status.toLowerCase()) {
    //   case "approved":
    //     return "bg-green-100 text-green-700 border-green-200";
    //   case "pending":
    //     return "bg-yellow-100 text-yellow-700 border-yellow-200";
    //   case "in review":
    //     return "bg-blue-100 text-blue-700 border-blue-200";
    //   case "rejected":
    //     return "bg-red-100 text-red-700 border-red-200";
    //   default:
    //     return "bg-gray-100 text-gray-700 border-gray-200";
    // }
  };

  return (
    <MainLayout title="My Events" subtitle="Manage your event submissions">
      <div className="container mx-auto px-6 pb-12">
        {/* Header Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex gap-2">
            {["all", "approved", "pending", "in review"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                  filter === status
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          <Link 
            to="/event-registration" 
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5" /> Create Event
          </Link>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div 
              key={event.id} 
              className="bg-card rounded-2xl overflow-hidden shadow-lg border border-border/50 hover:shadow-xl transition-all duration-300"
            >
              <div className="relative aspect-video">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(event.status)}`}>
                    {event.status}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-foreground mb-3">{event.title}</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Link 
                    to={`/event/${event.id}`}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </Link>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary/10 transition-colors">
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button className="flex items-center justify-center px-3 py-2.5 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No events found matching your filter.</p>
            <Link 
              to="/event-registration"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium"
            >
              <Plus className="w-5 h-5" />
              Create Your First Event
            </Link>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default MyEvents;