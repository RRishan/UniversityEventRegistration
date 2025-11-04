import { useState } from "react";
import axios from "axios";

function EventRegistrationForm() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    venue: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    participantsCount: "",
    organizationId: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Basic validation
    if (!form.title || !form.description || !form.category || !form.venue) {
      setError("Please fill all required fields ❌");
      return;
    }

    try {
      // ✅ Send JSON to backend
      const res = await axios.post(
        "http://localhost:3001/api/event/register",
        form,
        {
          headers: {
            "Content-Type": "application/json",
            // "Authorization": `Bearer ${token}` // uncomment if authentication is required
          },
        }
      );

      setMessage(res.data.message || "Event registered successfully ✅");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Event registration failed ❌");
    }
  };

  return (
    <div className="form-container">
      <h2>Register New Event</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Event Title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Event Description"
          value={form.description}
          onChange={handleChange}
          required
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          <option value="Educational">Educational</option>
          <option value="Music">Music</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Meeting">Meeting</option>
        </select>

        <select
          name="venue"
          value={form.venue}
          onChange={handleChange}
          required
        >
          <option value="">Select Venue</option>
          <option value="Bandaranayake Hall">Bandaranayake Hall</option>
          <option value="Sumangala Hall">Sumangala Hall</option>
          <option value="Gal pitiniya">Gal pitiniya</option>
        </select>

        <label>Start Date</label>
        <input
          type="date"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
          required
        />

        <label>Start Time</label>
        <input
          type="time"
          name="startTime"
          value={form.startTime}
          onChange={handleChange}
          required
        />

        <label>End Date</label>
        <input
          type="date"
          name="endDate"
          value={form.endDate}
          onChange={handleChange}
          required
        />

        <label>End Time</label>
        <input
          type="time"
          name="endTime"
          value={form.endTime}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="participantsCount"
          placeholder="Number of Participants"
          value={form.participantsCount}
          onChange={handleChange}
        />

        <input
          name="organizationId"
          placeholder="Organization ID"
          value={form.organizationId}
          onChange={handleChange}
        />

        <button type="submit">Register Event</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
    </div>
  );
}

export default EventRegistrationForm;
