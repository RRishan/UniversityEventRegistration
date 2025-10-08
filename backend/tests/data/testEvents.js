const eventData = {
  title: "Annual Music Concert",
  description: "Music concert with popular singers.",
  category: "Music",
  venue: "Bandaranayake Hall",
  startDate: "2025-11-07",
  startTime: "16:00",
  endDate: "2025-11-07",
  endTime: "20:00",
  participantsCount: 100,
  isApproved: true,
  organizationId: "OC1234"
};

// Arrays of invalid values with exact expected messages

const invalidTitles = [
  { value: 123, expectedMessage: "Invalid title" },
  { value: {}, expectedMessage: "Invalid title" },
  { value: [], expectedMessage: "Invalid title" }
];

const invalidDescriptions = [
  { value: 123, expectedMessage: "Invalid Description" },
  { value: {}, expectedMessage: "Invalid Description" },
  { value: [], expectedMessage: "Invalid Description" }
];

const invalidCategories = [
  { value: "123", expectedMessage: "Invalid Category" },
  { value: {}, expectedMessage: "Invalid Category" },
  { value: [], expectedMessage: "Invalid Category" }
];

const invalidVenues = [
  { value: 123, expectedMessage: "Invlid Venue" },
  { value: {}, expectedMessage: "Invlid Venue" },
  { value: [], expectedMessage: "Invlid Venue" }
];

const invalidStartDates = [
  { value: "Invalid Date", expectedMessage: "Invlid Start Date" },
  { value: "2025-02-30", expectedMessage: "Invlid Start Date" },
  { value: "15/10/2025", expectedMessage: "Invlid Start Date" },
  { value: 123, expectedMessage: "Invlid Start Date" }
];

const invalidStartTimes = [
  { value: "25:00", expectedMessage: "Invlid Start Time" },
  { value: "abc", expectedMessage: "Invlid Start Time" },
  { value: 123, expectedMessage: "Invlid Start Time" },
  { value: "9am", expectedMessage: "Invlid Start Time" }
];

const invalidEndDates = [
  { value: "Invalid Date", expectedMessage: "Invlid End Date" },
  { value: "2025-02-30", expectedMessage: "Invlid End Date" },
  { value: "01-12-2025", expectedMessage: "Invlid End Date" },
  { value: 123, expectedMessage: "Invlid End Date" }
];

const invalidEndTimes = [
  { value: "25:00", expectedMessage: "Invlid End Time" },
  { value: "abc", expectedMessage: "Invlid End Time" },
  { value: 123, expectedMessage: "Invlid End Time" },
  { value: "5pm", expectedMessage: "Invlid End Time" }
];

const invalidParticipantsCounts = [
  { value: -1, expectedMessage: "Invalid Participants Count" },
  { value: 0, expectedMessage: "Invalid Participants Count" },
  { value: "abc", expectedMessage: "Invalid Participants Count" },
  { value: {}, expectedMessage: "Invalid Participants Count" },
  { value: [], expectedMessage: "Invalid Participants Count" }
];

module.exports = {
  eventData,
  invalidTitles,
  invalidDescriptions,
  invalidCategories,
  invalidVenues,
  invalidStartDates,
  invalidStartTimes,
  invalidEndDates,
  invalidEndTimes,
  invalidParticipantsCounts
};
