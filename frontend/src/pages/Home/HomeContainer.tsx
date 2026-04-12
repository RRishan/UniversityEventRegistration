import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

import { AppContext } from "@/context/AppContext";
import HomePresenter, {
  type CalendarDay,
  type CalendarEventMap,
  type FeaturedDate,
  type HeroParticle,
  type HeroStat,
  type UpcomingEvent,
} from "./HomePresenter";

const HERO_STATS: HeroStat[] = [
  { id: "events", value: "200+", label: "Events / year", icon: "calendar" },
  { id: "attendees", value: "5k+", label: "Attendees", icon: "users" },
  { id: "organizers", value: "40+", label: "Organizers", icon: "trophy" },
];

const HERO_PARTICLES: HeroParticle[] = [
  { size: 5, x: 8, delay: 0, duration: 10 },
  { size: 3, x: 20, delay: 2.5, duration: 13 },
  { size: 6, x: 38, delay: 1, duration: 9 },
  { size: 4, x: 55, delay: 3.5, duration: 12 },
  { size: 3, x: 72, delay: 0.5, duration: 11 },
  { size: 5, x: 85, delay: 4, duration: 14 },
  { size: 4, x: 92, delay: 1.5, duration: 10 },
  { size: 3, x: 48, delay: 5, duration: 15 },
];

const CALENDAR_EVENT_MAP: CalendarEventMap = {
  "13": {
    title: "KIZUNA KIOKO",
    time: "7:00 PM - 10:00 PM",
    location: "Main Auditorium",
  },
  "24": {
    title: "INNA",
    time: "8:00 PM - 11:00 PM",
    location: "Campus Ground",
  },
};

const getCalendarDays = (date: Date, highlightedDays: number[]): CalendarDay[] => {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDayOffset = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const totalCells = firstDayOffset + daysInMonth;
  const trailingBlanks = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);

  const leadingBlankCells = Array.from({ length: firstDayOffset }, () => ({ day: "", highlighted: false }));

  const monthCells = Array.from({ length: daysInMonth }, (_, index) => {
    const dayNumber = index + 1;
    return {
      day: `${dayNumber}`,
      highlighted: highlightedDays.includes(dayNumber),
    };
  });

  const trailingBlankCells = Array.from({ length: trailingBlanks }, () => ({ day: "", highlighted: false }));

  return [...leadingBlankCells, ...monthCells, ...trailingBlankCells];
};

const HomeContainer = () => {
  const { isLoggedIn, backendUrl } = useContext(AppContext);

  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [isEventsLoading, setIsEventsLoading] = useState(true);

  const calendarEventMap = useMemo(() => CALENDAR_EVENT_MAP, []);
  const heroParticles = useMemo(() => HERO_PARTICLES, []);
  const heroStats = useMemo(() => HERO_STATS, []);

  const monthYearLabel = useMemo(
    () => new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long" }).format(new Date()),
    [],
  );

  const highlightedDays = useMemo(
    () => Object.keys(calendarEventMap).map((day) => Number(day)),
    [calendarEventMap],
  );

  const calendarDays = useMemo(() => getCalendarDays(new Date(), highlightedDays), [highlightedDays]);

  const featuredDates = useMemo<FeaturedDate[]>(
    () => [
      { date: "Feb 13", name: "KIZUNA KIOKO", color: "from-blue-500 to-indigo-500" },
      { date: "Feb 24", name: "INNA", color: "from-sky-500 to-blue-500" },
    ],
    [],
  );

  const fetchUpcomingEvents = useCallback(async () => {
    setIsEventsLoading(true);

    try {
      axios.defaults.withCredentials = true;
      const response = await axios.get(`${backendUrl}/api/event/events`);

      if (!response.data.success) {
        toast.error(response.data.message || "Failed to load events.");
        setUpcomingEvents([]);
        return;
      }

      const normalizedEvents: UpcomingEvent[] = response.data.message.map((event: any) => ({
        id: event._id,
        title: event.eventTitle,
        description: event.description,
        image: event.imageLink,
        category: `${event.category.charAt(0).toUpperCase()}${event.category.slice(1)}`,
        readTime: `${Math.ceil(event.expectedAttendees / 10)} min read`,
      }));

      setUpcomingEvents(normalizedEvents);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong while loading events.");
      setUpcomingEvents([]);
    } finally {
      setIsEventsLoading(false);
    }
  }, [backendUrl]);

  useEffect(() => {
    fetchUpcomingEvents();
  }, [fetchUpcomingEvents]);

  return (
    <HomePresenter
      isLoggedIn={isLoggedIn}
      isEventsLoading={isEventsLoading}
      upcomingEvents={upcomingEvents}
      calendarDays={calendarDays}
      calendarEventMap={calendarEventMap}
      monthYearLabel={monthYearLabel}
      featuredDates={featuredDates}
      heroParticles={heroParticles}
      heroStats={heroStats}
      onRetryEvents={fetchUpcomingEvents}
    />
  );
};

export default HomeContainer;

