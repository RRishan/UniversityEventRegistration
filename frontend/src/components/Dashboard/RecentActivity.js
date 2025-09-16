import React from "react";

const RecentActivity = () => {
  const activities = [
    "Logged in",
    "Updated profile",
    "Completed task #23",
    "Joined Project Alpha",
  ];

  return (
    <section className="recent-activity">
      <h3>Recent Activity</h3>
      <ul>
        {activities.map((act, i) => (
          <li key={i}>{act}</li>
        ))}
      </ul>
    </section>
  );
};

export default RecentActivity;
