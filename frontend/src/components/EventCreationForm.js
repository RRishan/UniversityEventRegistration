import { useState } from "react";
import api from "../api"; // adjust path if needed

function EventCreationForm() {
  const [form, setForm] = useState({
    applicantName: "",
    email: "",
    registrationNumber: "",
    telephoneNumber: "",
    faculty: "",
    department: "",
    society: "",
    activity: "",
    hall: "",
    date: "",
    participants: "",
    timeFrom: "",
    timeTo: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.applicantName || !form.email || !form.registrationNumber) {
      setError("Please fill all compulsory fields ❌");
      return;
    }

    if (form.timeTo <= form.timeFrom) {
      setError("End time must be after start time ❌");
      return;
    }

    if (form.timeTo > "23:00") {
      setError("Activities cannot continue after 11:00 PM ❌");
      return;
    }

    try {
      const res = await api.post("/events/register", form);
      setMessage(res.data.message || "Event registered successfully ✅");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Event registration failed");
    }
  };

  return (
    <div className="form-container">
      <h2>Event Registration Form</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="applicantName"
          placeholder="Applicant's Name"
          value={form.applicantName}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="registrationNumber"
          placeholder="Registration Number"
          value={form.registrationNumber}
          onChange={handleChange}
          required
        />

        <input
          name="telephoneNumber"
          placeholder="Telephone Number"
          value={form.telephoneNumber}
          onChange={handleChange}
          required
        />

        <input
          name="faculty"
          placeholder="Faculty"
          value={form.faculty}
          onChange={handleChange}
          required
        />

        <input
          name="department"
          placeholder="Department"
          value={form.department}
          onChange={handleChange}
          required
        />

        <input
          name="society"
          placeholder="Society/Organization"
          value={form.society}
          onChange={handleChange}
          required
        />

        {/* Activity ENUM */}
        <select
          name="activity"
          value={form.activity}
          onChange={handleChange}
          required
        >
          <option value="">Select Activity</option>
          <option value="Educational">Educational event</option>
          <option value="Music">Music event</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Meeting">Meeting</option>
        </select>

        {/* Hall ENUM */}
        <select
          name="hall"
          value={form.hall}
          onChange={handleChange}
          required
        >
          <option value="">Select Hall/Ground</option>
          <option value="Bandaranayake">Bandaranayake hall</option>
          <option value="Sumangala">Sumangala hall</option>
          <option value="GalPitiya">Gal pitaniya</option>
        </select>

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="participants"
          placeholder="Number of Participants"
          value={form.participants}
          onChange={handleChange}
          min="1"
          required
        />

        <label>Time (From – To)</label>
        <input
          type="time"
          name="timeFrom"
          value={form.timeFrom}
          onChange={handleChange}
          required
        />
        <input
          type="time"
          name="timeTo"
          value={form.timeTo}
          onChange={handleChange}
          required
        />

        <button type="submit">Register Event</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
    </div>
  );
}

export default EventCreationForm;
