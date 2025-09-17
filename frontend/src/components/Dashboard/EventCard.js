// src/components/Dashboard/EventCard.jsx
import React from "react";

const EventCard = ({ event }) => (
  <div className="event-card">
    <h4>{event.title}</h4>
    <p>Date: {event.date}</p>
  </div>
);

export default EventCard;
