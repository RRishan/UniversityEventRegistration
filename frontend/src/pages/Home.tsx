import { Link } from "react-router-dom";
import crowdBg from "@/assets/crowd-bg.jpg";
import event1 from "@/assets/event-1.jpg";
import event2 from "@/assets/event-2.jpg";
import event3 from "@/assets/event-3.jpg";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "@/context/AppContext";
import { toast } from "sonner";
import axios from "axios";

// Event data for calendar
const calendarEvents: Record<string, { title: string; time: string; location: string }> = {
  "13": { title: "KIZUNA KIOKO", time: "7:00 PM - 10:00 PM", location: "Main Auditorium" },
  "24": { title: "INNA", time: "8:00 PM - 11:00 PM", location: "Campus Ground" }
};

// Calendar data for February
const calendarDays = [
  { day: "", highlighted: false },
  { day: "", highlighted: false },
  { day: "1", highlighted: false },
  { day: "2", highlighted: false },
  { day: "3", highlighted: false },
  { day: "4", highlighted: false },
  { day: "5", highlighted: false },
  { day: "6", highlighted: false },
  { day: "7", highlighted: false },
  { day: "8", highlighted: false },
  { day: "9", highlighted: false },
  { day: "10", highlighted: false },
  { day: "11", highlighted: false },
  { day: "12", highlighted: false },
  { day: "13", highlighted: true },
  { day: "14", highlighted: false },
  { day: "15", highlighted: false },
  { day: "16", highlighted: false },
  { day: "17", highlighted: false },
  { day: "18", highlighted: false },
  { day: "19", highlighted: false },
  { day: "20", highlighted: false },
  { day: "21", highlighted: false },
  { day: "22", highlighted: false },
  { day: "23", highlighted: false },
  { day: "24", highlighted: true },
  { day: "25", highlighted: false },
  { day: "26", highlighted: false },
  { day: "27", highlighted: false },
  { day: "28", highlighted: false },
  { day: "29", highlighted: false },
  { day: "", highlighted: false },
  { day: "", highlighted: false },
  { day: "", highlighted: false },
  { day: "", highlighted: false }
];

const CalendarDay = ({ day, highlighted }: { day: string; highlighted: boolean }) => {
  if (!day) return <div className="text-center text-sm py-2" />;
  
  if (highlighted && calendarEvents[day]) {
    const event = calendarEvents[day];
    return (
      <HoverCard openDelay={100} closeDelay={100}>
        <HoverCardTrigger asChild>
          <div 
            className="text-center text-sm py-2 rounded-lg cursor-pointer font-semibold transition-all duration-200"
            style={{ 
              backgroundColor: "hsl(142 76% 36%)", 
              color: "white",
            }}
          >
            {day}
          </div>
        </HoverCardTrigger>
        <HoverCardContent 
          className="w-64 p-4 bg-white border border-border shadow-xl rounded-xl"
          side="top"
          align="center"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: "hsl(142 76% 36%)" }}
              />
              <span className="text-xs text-muted-foreground">Feb {day}</span>
            </div>
            <h4 className="font-bold text-foreground text-base">{event.title}</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{event.location}</span>
              </div>
            </div>
            <Link 
              to={`/event/${day}`}
              className="inline-block mt-2 text-sm font-medium text-primary hover:underline"
            >
              View details →
            </Link>
          </div>
        </HoverCardContent>
      </HoverCard>
    );
  }

  return (
    <div 
      className={`text-center text-sm py-2 rounded-lg ${
        day ? "text-foreground hover:bg-muted cursor-pointer transition-colors" : ""
      }`}
    >
      {day}
    </div>
  );
};

const Home = () => {


  const {isLoggedIn, backendUrl} = useContext(AppContext);
  const [upcomingEvents, setUpcomingEvents] = useState([
  {
    id: "1",
    title: "Leadership development workshop",
    description: "Join our interactive session on building professional skills and networking strategies.",
    image: event1,
    category: "Workshop",
    readTime: "5 min read"
  },
  {
    id: "2",
    title: "Research innovation showcase",
    description: "Discover groundbreaking student and faculty research projects across disciplines.",
    image: event2,
    category: "Seminars",
    readTime: "5 min read"
  },
  {
    id: "3",
    title: "Cultural exchange night",
    description: "Connect with international students and explore diverse cultural experiences.",
    image: event3,
    category: "Socials",
    readTime: "5 min read"
  }
  ]);

  const getAllEvents = async () => {
    try {
      
      axios.defaults.withCredentials = true;

      const {data} = await axios.get(backendUrl + '/api/event/events');

      if (data.success) {
        console.log(data.message);
        const formattedEvents = data.message.map((event: any) => ({
          id: event._id,
          title: event.eventTitle,
          description: event.description,
          image: event.imageLink,
          category: event.category.charAt(0).toUpperCase() + event.category.slice(1),
          readTime: `${Math.ceil(event.expectedAttendees / 10)} min read`
        }));

        setUpcomingEvents(formattedEvents);
      }else {
        toast.error(data.message);
      }


    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() =>{
    getAllEvents();
  }, [])


  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ backgroundColor: "hsl(231 62% 45%)" }}>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${crowdBg})`,
            opacity: 0.4 
          }}
        />
        <div className="relative container mx-auto px-6 py-16">
          <div className="flex items-start justify-between gap-12">
            {/* Left Content */}
            <div className="flex-1 max-w-xl">
              <div 
                className="rounded-3xl p-10 border backdrop-blur-sm"
                style={{ 
                  backgroundColor: "rgba(0, 0, 0, 0.25)",
                  borderColor: "rgba(255, 255, 255, 0.1)"
                }}
              >
                <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
                  Discover and manage<br />university events
                </h1>
                <p className="text-white/80 text-sm mb-8 leading-relaxed">
                  Streamline event registration and approval for students, organizers, and faculty. Find, create, and track events with ease.
                </p>
                <div className="flex gap-4">
                  <Link 
                    to="/events" 
                    className="bg-white px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                    style={{ color: "hsl(231 62% 45%)" }}
                  >
                    Browse events
                  </Link>
                  {
                    !isLoggedIn && (
                      <Link 
                        to="/event-registration" 
                        className="px-6 py-2.5 rounded-lg text-sm font-medium border text-white hover:bg-white/10 transition-colors"
                        style={{ 
                          backgroundColor: "hsl(231 62% 45%)",
                          borderColor: "rgba(255, 255, 255, 0.3)"
                        }}
                      >
                        Register
                      </Link>
                    )
                  }
                  
                </div>
              </div>
            </div>

            {/* Right Content - Calendar */}
            <div className="flex-1 max-w-md">
              <h2 className="text-2xl font-bold text-white mb-4">Events dates</h2>
              
              {/* Calendar Widget */}
              <div className="bg-white rounded-xl p-4 shadow-lg mb-6">
                <div className="flex items-center justify-between mb-4">
                  <button className="text-gray-400 hover:text-gray-600 p-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <span className="font-semibold text-gray-900">February</span>
                  <button className="text-gray-400 hover:text-gray-600 p-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                
                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
                    <div key={day} className="text-center text-xs text-gray-500 font-medium py-1">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((item, index) => (
                    <CalendarDay key={index} day={item.day} highlighted={item.highlighted} />
                  ))}
                </div>
              </div>

              {/* Event Dates List */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-white">
                  <span className="text-sm font-medium">• Feb 13</span>
                  <span className="text-sm">—</span>
                  <span className="text-sm font-semibold">KIZUNA KIOKO</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <span className="text-sm font-medium">• Feb 20</span>
                  <span className="text-sm">—</span>
                  <span className="text-sm font-semibold">INNA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Campus Events */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Upcoming campus events</h2>
            <p className="text-gray-500">
              Explore the latest events happening across our university community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {upcomingEvents.map((event) => (
              <Link
                key={event.id}
                to={`/event/${event.id}`}
                className="group block"
              >
                <div className="rounded-2xl overflow-hidden mb-4">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-medium" style={{ color: "hsl(231 62% 45%)" }}>{event.category}</span>
                  <span className="text-xs text-gray-500">{event.readTime}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                  {event.title}
                </h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                  {event.description}
                </p>
                <span className="text-sm text-gray-900 font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Learn more
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/events"
              className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
            >
              View all events
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 overflow-hidden" style={{ backgroundColor: "hsl(231 62% 45%)" }}>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${crowdBg})`,
            opacity: 0.3 
          }}
        />
        <div className="relative container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Start managing your events today
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Create, track, and engage with campus events through our streamlined platform.
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              to="/event-registration" 
              className="bg-white px-6 py-3 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              style={{ color: "hsl(231 62% 45%)" }}
            >
              Register now
            </Link>
            <Link 
              to="/events" 
              className="bg-transparent text-white px-6 py-3 rounded-lg text-sm font-medium border border-white/30 hover:bg-white/10 transition-colors"
            >
              Learn more
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
