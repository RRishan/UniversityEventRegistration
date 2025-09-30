// src/components/Dashboard/EventList.jsx
import React, { useContext } from "react";
import { UserContext } from "../../Context/UserContext";
import EventCard from "./EventCard";

const EventList = ({ events }) => {
  return (
    <div className="event-list">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};

export default EventList;
