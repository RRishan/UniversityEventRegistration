// src/components/Dashboard/EventList.jsx
import React, { useState } from "react";
import EventCard from "./EventCard";
import "./EventList.css";

export default function EventList({ events }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || event.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="event-listing-container">
      {/* Event Listing */}
      <div className="event-listing">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event, index) => (
            <EventCard key={index} event={event} />
          ))
        ) : (
          <p className="no-events">No events found.</p>
        )}
      </div>
    </div>
  );
}


