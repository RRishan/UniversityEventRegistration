import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./EventCreationForm.css";

function EventCreationForm() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
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
    // New fields
    faculty: "",
    department: "",
    applicantName: "",
    registrationNumber: "",
    email: "",
    telephone: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const steps = [
    { id: 1, label: "Event Details" },
    { id: 2, label: "Venue Selection" },
    { id: 3, label: "Document Upload" },
    { id: 4, label: "Review" },
    { id: 5, label: "Submission" }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Final submission logic
    try {
      // Mapping "date" to startDate and endDate if needed
      const submissionData = {
        ...form,
        // Ensure backend compatibility if needed
      };

      const res = await axios.post("http://localhost:3001/api/event/register", submissionData);
      setMessage(res.data.message || "Event registered successfully ✅");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Event registration failed ❌");
    }
  };

  return (
    <div className="event-creation-container">
      {/* Sidebar */}
      <div className="sidebar">
        {steps.map((step) => (
          <div key={step.id} className={`step-item ${currentStep === step.id ? 'active' : ''}`}>
            <div className="step-number">{step.id}</div>
            <div className="step-label">{step.label}</div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header Navbar */}
        <div className="form-header-nav">
          <h1>Event Registration</h1>
          <div className="user-profile">
            <div className="user-avatar"></div>
            <span>Logout</span>
          </div>
          <div className="step-progress-text" style={{ fontSize: '12px', color: '#6b7280' }}>Step {currentStep} of 5</div>
        </div>

        {/* Blue Background Form Area */}
        <div className="form-area-wrapper">
          <div className="form-content">
            {currentStep === 1 && (
              <>
                <div className="form-step-header">
                  <h2>Event Details</h2>
                </div>

                <div className="form-grid">
                  <div className="input-group full-width">
                    <label>Event Title <span>*</span></label>
                    <input
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="Enter event title"
                    />
                  </div>
                  <div className="input-group full-width">
                    <label>Description <span>*</span></label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Describe your event"
                    />
                  </div>
                  <div className="input-group full-width">
                    <label>Category <span>*</span></label>
                    <select name="category" value={form.category} onChange={handleChange}>
                      <option value="">Select a category</option>
                      <option value="Educational">Educational</option>
                      <option value="Music">Music</option>
                      <option value="Entertainment">Entertainment</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label>Event Date <span>*</span></label>
                    <input
                      type="date"
                      name="startDate"
                      value={form.startDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="input-group">
                    <label>Expected Attendees <span>*</span></label>
                    <input
                      type="number"
                      name="participantsCount"
                      value={form.participantsCount}
                      onChange={handleChange}
                      placeholder="0"
                    />
                  </div>

                  <div className="input-group">
                    <label>Start Time <span>*</span></label>
                    <input
                      type="time"
                      name="startTime"
                      value={form.startTime}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="input-group">
                    <label>End Time <span>*</span></label>
                    <input
                      type="time"
                      name="endTime"
                      value={form.endTime}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="input-group">
                    <label>Faculty <span>*</span></label>
                    <input
                      name="faculty"
                      value={form.faculty}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="input-group">
                    <label>Department <span>*</span></label>
                    <input
                      name="department"
                      value={form.department}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="input-group">
                    <label>applicants name <span>*</span></label>
                    <input
                      name="applicantName"
                      value={form.applicantName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="input-group">
                    <label>Registration number <span>*</span></label>
                    <input
                      name="registrationNumber"
                      value={form.registrationNumber}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="input-group">
                    <label>Email address <span>*</span></label>
                    <input
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="input-group">
                    <label>Telephone number <span>*</span></label>
                    <input
                      name="telephone"
                      value={form.telephone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </>
            )}

            {currentStep > 1 && (
              <div className="placeholder-step">
                <h3>{steps[currentStep - 1].label}</h3>
                <p>Content for this step is under development.</p>
              </div>
            )}

            <div className="form-footer">
              <button className="btn-nav btn-back" onClick={handleBack} disabled={currentStep === 1}>
                ← Back
              </button>
              {currentStep < 5 ? (
                <button className="btn-nav btn-next" onClick={handleNext}>
                  Next →
                </button>
              ) : (
                <button className="btn-nav btn-next" onClick={handleSubmit}>
                  Submit
                </button>
              )}
            </div>

            {error && <p style={{ color: "#fca5a5", marginTop: "10px" }}>{error}</p>}
            {message && <p style={{ color: "#86efac", marginTop: "10px" }}>{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventCreationForm;
