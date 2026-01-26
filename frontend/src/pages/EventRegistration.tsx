import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import crowdBg from "@/assets/crowd-bg.jpg";
import { ArrowLeft, ArrowRight, Calendar, Clock } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { AppContext } from "@/context/AppContext";

const EventRegistration = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const {backendUrl} = useContext(AppContext);
  const [formData, setFormData] = useState({
    // Step 1 - Event Details
    eventTitle: "",
    description: "",
    category: "",
    eventDate: "",
    expectedAttendees: 0,
    startTime: "",
    endTime: "",
    faculty: "",
    department: "",
    applicantName: "",
    registrationNumber: "",
    emailAddress: "",
    telephoneNumber: "",
    imageLink: "",
    // Step 2 - Venue
    venue: "",
    // Step 3 - Documents
    documents: [] as File[],
  });

  const steps = [
    { id: 1, label: "Event Details" },
    { id: 2, label: "Venue Selection" },
    { id: 3, label: "Document Upload" },
    { id: 4, label: "Review" },
    { id: 5, label: "Submission" },
  ];

  const handleNext = async () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        axios.defaults.withCredentials = true;
        console.log(formData)
        const {data} = await axios.post(backendUrl + "/api/event/register", {eventTitle: formData.eventTitle, description: formData.description,
          category: formData.category, eventDate: formData.eventDate, expectedAttendees: formData.expectedAttendees,
          startTime: formData.startTime, endTime: formData.endTime, faculty: formData.faculty, department: formData.department,
          applicantName: formData.applicantName, registrationNumber: formData.registrationNumber,
          emailAddress: formData.emailAddress, telephoneNumber: formData.telephoneNumber, venue: formData.venue,
          imageLink: formData.imageLink
        });
        console.log(data);

        if (data.success) {
          toast.success("Event submitted successfully!");
          setCurrentStep(5);
          navigate("/my-events");
        }else {
          toast.error(data.message);
        }

      } catch (error) {
        console.error(error.response?.data);
        toast.error(error.message);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files[0];

      if (!file) return toast.error("No file selected.");

      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "event-registration");

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dadxdprtg/image/upload",
        data, { withCredentials: false }
      );

      setFormData({ ...formData, imageLink: response.data.secure_url });

    } catch (error) {
      toast.error("File upload failed. Please try again.");
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label className="text-primary-foreground text-sm mb-1 block">Event Title *</label>
              <input
                type="text"
                placeholder="Enter event title"
                value={formData.eventTitle}
                onChange={(e) => setFormData({ ...formData, eventTitle: e.target.value })}
                className="form-input"
              />
            </div>

            <div>
              <label className="text-primary-foreground text-sm mb-1 block">Description *</label>
              <textarea
                placeholder="Describe your event"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="form-input resize-none"
              />
            </div>

            <div>
              <label className="text-primary-foreground text-sm mb-1 block">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="form-select"
              >
                <option value="">Select a category</option>
                <option value="workshop">Workshop</option>
                <option value="seminar">Seminar</option>
                <option value="conference">Conference</option>
                <option value="cultural">Cultural Event</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-primary-foreground text-sm mb-1 block">Event Date *</label>
                <div className="relative">
                  <input
                    type="date"
                    placeholder="MM/DD/YYYY"
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="form-input pr-10"
                  />
                </div>
              </div>
              <div>
                <label className="text-primary-foreground text-sm mb-1 block">Expected Attendees *</label>
                <input
                  type="number"
                  placeholder="0"
                  value={formData.expectedAttendees}
                  onChange={(e) => setFormData({ ...formData, expectedAttendees: parseInt(e.target.value) || 0 })}
                  className="form-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-primary-foreground text-sm mb-1 block">Start Time *</label>
                <div className="relative">
                  <input
                    type="time"
                    placeholder="HH:MM AM"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="form-input pr-10"
                  />
                </div>
              </div>
              <div>
                <label className="text-primary-foreground text-sm mb-1 block">End Time *</label>
                <div className="relative">
                  <input
                    type="time"
                    placeholder="HH:MM PM"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="form-input pr-10"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-primary-foreground text-sm mb-1 block">Faculty *</label>
                <input
                  type="text"
                  value={formData.faculty}
                  onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                  className="form-input"
                />
              </div>
              <div>
                <label className="text-primary-foreground text-sm mb-1 block">Department *</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* <div>
                <label className="text-primary-foreground text-sm mb-1 block">applicants name *</label>
                <input
                  type="text"
                  value={formData.applicantName}
                  onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                  className="form-input"
                />
              </div> */}
              {/* <div>
                <label className="text-primary-foreground text-sm mb-1 block">Registration number *</label>
                <input
                  type="text"
                  value={formData.registrationNumber}
                  onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                  className="form-input"
                />
              </div> */}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-primary-foreground text-sm mb-1 block">Email address *</label>
                <input
                  type="email"
                  value={formData.emailAddress}
                  onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
                  className="form-input"
                />
              </div>
              <div>
                <label className="text-primary-foreground text-sm mb-1 block">Telephone number *</label>
                <input
                  type="tel"
                  value={formData.telephoneNumber}
                  onChange={(e) => setFormData({ ...formData, telephoneNumber: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="text-primary-foreground text-sm mb-1 block">place</label>
              <select
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                className="form-select"
              >
                <option value="">select a place</option>
                <option value="auditorium">Main Auditorium</option>
                <option value="conference">Conference Hall A</option>
                <option value="outdoor">Outdoor Arena</option>
                <option value="classroom">Classroom Block</option>
              </select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            {
              formData.imageLink != '' && (
                <img src={formData.imageLink} alt="Uploaded Document" className="img max-w-[400px] rounded-lg" />
              )
            }
            <form className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <p className="text-muted-foreground text-white">Drag and drop files here or click to upload</p>
                <input type="file" onChange={handleFileUpload} accept=".png, .jpg, .jpeg" className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg" />
            </form>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary-foreground">Review Your Event</h3>
            <div className="bg-white/10 rounded-lg p-4 space-y-2">
              <p><strong>Title:</strong> {formData.eventTitle || "Not provided"}</p>
              <p><strong>Description:</strong> {formData.description || "Not provided"}</p>
              <p><strong>Category:</strong> {formData.category || "Not provided"}</p>
              <p><strong>Date:</strong> {formData.eventDate || "Not provided"}</p>
              <p><strong>Venue:</strong> {formData.venue || "Not provided"}</p>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="text-center space-y-4">
            <div className="w-20 h-20 mx-auto bg-success rounded-full flex items-center justify-center">
              <span className="text-4xl">✓</span>
            </div>
            <h3 className="text-2xl font-semibold text-primary-foreground">Event Submitted!</h3>
            <p className="text-primary-foreground/80">Your event has been submitted for approval.</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Sub Header */}
      <div className="bg-white border-b border-border py-4 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold">Event Registration</h1>
          <span className="text-muted-foreground">Step {currentStep} of 5</span>
        </div>
        
        {/* Progress Bar */}
        <div className="container mx-auto mt-4">
          <div className="flex gap-2">
            {steps.map((step) => (
              <div 
                key={step.id}
                className={`flex-1 h-2 rounded-full transition-colors ${
                  step.id <= currentStep ? 'bg-foreground' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <main className="flex-1 relative">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${crowdBg})` }}
        />
        <div className="absolute inset-0 bg-primary/85" />
        
        <div className="relative z-10 container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Step Navigation */}
            <div className="space-y-2">
              {steps.map((step) => (
                <div 
                  key={step.id}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    step.id === currentStep 
                      ? 'bg-foreground text-background' 
                      : 'text-primary-foreground/70'
                  }`}
                >
                  <span className={`step-indicator ${
                    step.id === currentStep 
                      ? 'bg-background text-foreground' 
                      : step.id < currentStep 
                        ? 'step-completed' 
                        : 'step-pending'
                  }`}>
                    {step.id}
                  </span>
                  <span>{step.label}</span>
                </div>
              ))}
            </div>

            {/* Form Content */}
            <div className="lg:col-span-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-primary-foreground mb-6">
                  {steps[currentStep - 1].label}
                </h2>
                
                {renderStepContent()}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                  <button
                    onClick={handleBack}
                    disabled={currentStep === 1}
                    className="flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-lg font-medium disabled:opacity-50"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-3 border-2 border-primary-foreground text-primary-foreground rounded-lg font-medium hover:bg-primary-foreground/10"
                  >
                    {currentStep === 5 ? 'Finish' : 'Next'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EventRegistration;
