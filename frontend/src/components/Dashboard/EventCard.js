// src/components/EventCard.js
import React from "react";


export default function EventCard({ event }) {
  // Example event object structure:
  // {
  //   title, date, startTime, endTime,
  //   venue, category, description, posterUrl
  // }

  return (
    <div className="event-card">
      {/* Poster/Flyer */}
      {event.posterUrl && (
        <div className="event-card-poster">
          <img src={event.posterUrl} alt={`${event.title} poster`} />
        </div>
      )}

      <div className="event-card-body">
        <h3 className="event-title">{event.title}</h3>

        {/* Date */}
        <p className="event-date">
          <strong>Date:</strong> {event.date}
        </p>

        {/* Start & End Time */}
        {event.startTime && event.endTime && (
          <p className="event-time">
            <strong>Time:</strong> {event.startTime} – {event.endTime}
          </p>
        )}

        {/* Venue/Location */}
        {event.venue && (
          <p className="event-venue">
            <strong>Venue:</strong> {event.venue}
          </p>
        )}

        {/* Category */}
        {event.category && (
          <p className="event-category">
            <strong>Category:</strong> {event.category}
          </p>
        )}

        {/* Description/Summary */}
        {event.description && (
          <p className="event-description">{event.description}</p>
        )}
      </div>
    </div>
  );
}

<EventCard
  event={{
    title: "Music Night",
    date: "2025-10-05",
    startTime: "6:00 PM",
    endTime: "9:00 PM",
    venue: "Main Hall",
    category: "Music",
    description: "An evening of live performances.",
    posterUrl: "/images/music-night.jpg",
  }}
/>


