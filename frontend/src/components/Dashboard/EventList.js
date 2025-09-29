// src/components/Dashboard/EventList.jsx
import React, { useContext } from "react";
import { UserContext } from "../../Context/UserContext";
import EventCard from "./EventCard";

const EventList = () => {
  const { events } = useContext(UserContext);

  return (
    <div className="event-list">
      <h3>Upcoming Events</h3>
      {events.length > 0 ? (
        <div className="event-grid">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <p>No events available.</p>
      )}
    </div>
  );
};

export default EventList;
