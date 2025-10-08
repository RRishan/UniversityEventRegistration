// src/tests/EventCard.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import EventCard from "./EventCard";

const sampleEvent = {
  title: "Sample Event",
  date: "2025-10-10",
  startTime: "10:00",
  endTime: "12:00",
  venue: "Main Hall",
  category: "Music",
  description: "Test event description",
  poster: "/images/sample.jpg",
};

test("renders event details correctly", () => {
  render(<EventCard event={sampleEvent} />);

  expect(screen.getByText(/sample event/i)).toBeInTheDocument();
  expect(screen.getByText(/10:00 – 12:00/i)).toBeInTheDocument();
  expect(screen.getByText(/main hall/i)).toBeInTheDocument();
  expect(screen.getByText(/music/i)).toBeInTheDocument();
  expect(screen.getByText(/test event description/i)).toBeInTheDocument();
  expect(screen.getByRole("img")).toHaveAttribute("src", sampleEvent.poster);
});
