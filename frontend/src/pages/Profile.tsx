import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { AppContext } from "@/context/AppContext";
import axios from "axios";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "organizer",
    clubSociety: "Association of computer science",
    position: "",
    advisorName: "",
    advisorEmail: "",
    universityEmail: "organizer@gmail.com",
    registrationNumber: "organizer",
    phoneNumber: "123115616",
    notificationTypes: {
      eventStatus: false,
      approvalRequests: false,
      commentsFeedback: false,
      systemAnnouncements: false,
    },
    deliveryChannels: {
      sms: false,
      email: false,
    },
  });

  const {backendUrl, userData, isLoggedIn} = useContext(AppContext);

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      const {data} = await axios.post(backendUrl + '/api/organizer/profile', formData);

      if(data.success) {
        toast.success("Profile updated successfully");
        navigate("/");
      }else {
        console.log(data.message)
        toast.error("Failed to update profile" + data.message);
      }

    
    } catch (error) {
      console.log(error.message)
      toast.error("An error occurred while updating profile");
    }
  };

  const getAllData = async () => {
    
    try {
        
        axios.defaults.withCredentials = true;

        if (userData?.role == 'student') {
            const {data} = await axios.get(backendUrl + '/api/student/profile');
            if (data.success) {
                const {fullName, email, registrationNumber, phoneNumber} = data.message;
                console.log(data.message);
                setFormData({ ...formData, fullName, universityEmail: email, registrationNumber, phoneNumber });
            }else {
                toast.error("Error fetching profile data: " + data.message);
            }
        }else if (userData?.role == 'organizer') {
            const {data} = await axios.get(backendUrl + '/api/organizer/profile');
            if (data.success) {
                const {fullName, email, contactNum, organizerProfile, regiNumber} = data.message;
                setFormData({ ...formData, fullName, universityEmail: email, registrationNumber: regiNumber, phoneNumber: contactNum, clubSociety: organizerProfile.clubSociety, position: organizerProfile.position, advisorName: organizerProfile.advisorName, advisorEmail: organizerProfile.advisorEmail });
            }else {
                toast.error("Error fetching profile data: " + data.message);
            }
        }else if (userData?.role == 'lecture') {
            
            const {data} = await axios.get(backendUrl + '/api/lecture/profile');
            if (data.success) {
                const {fullName, email, contactNum, lectureProfile, regiNumber} = data.message;
                console.log(data.message);
                setFormData({ ...formData, fullName, universityEmail: email, registrationNumber: regiNumber, phoneNumber: contactNum, position: lectureProfile.position });
            }else {
                toast.error("Error fetching profile data: " + data.message);
            }
        }
        
    } catch (error) {
        toast.error("Error fetching profile data " + error.message);
    }
  }

  useEffect(() => {
    getAllData();
  }, []);

  return (
    <MainLayout title="My Profile" subtitle="Manage your account information and preferences">
      <div className="container mx-auto px-6 pb-12">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Personal Info */}
            <div className="card-white">
              <div className="flex flex-col items-center mb-6">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-3">
                  <span className="text-3xl">👤</span>
                </div>
                <h3 className="font-semibold text-foreground">{formData.fullName}</h3>
                <span className="px-3 py-1 bg-warning text-warning-foreground text-xs rounded mt-1">
                  {userData?.role.toUpperCase()}
                </span>
                <p className="text-sm text-muted-foreground mt-1">{formData.clubSociety}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="form-label text-xs">Full Name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label text-xs">University Email</label>
                  <input
                    type="email"
                    value={formData.universityEmail}
                    onChange={(e) => setFormData({ ...formData, universityEmail: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label text-xs">Registration Number</label>
                  <input
                    type="text"
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label text-xs">Phone number</label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* Right Columns */}
            <div className="lg:col-span-2 space-y-6">
              {/* Organizer Details */}
              {
                userData && userData.role === 'organizer' && (
                  <div className="bg-muted/50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Organizer Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="form-label text-xs">Club/Society</label>
                        <input
                          type="text"
                          value={formData.clubSociety}
                          onChange={(e) => setFormData({ ...formData, clubSociety: e.target.value })}
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label className="form-label text-xs">Position</label>
                        <input
                          type="text"
                          value={formData.position}
                          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label className="form-label text-xs">Advisor Name</label>
                        <input
                          type="text"
                          value={formData.advisorName}
                          onChange={(e) => setFormData({ ...formData, advisorName: e.target.value })}
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label className="form-label text-xs">Advisor Email</label>
                        <input
                          type="email"
                          value={formData.advisorEmail}
                          onChange={(e) => setFormData({ ...formData, advisorEmail: e.target.value })}
                          className="form-input"
                        />
                      </div>
                    </div>
                  </div>
                )
              }
              

              {/* Notification Preferences */}
              {
                userData && userData.role === 'organizer' && (
                  <div className="bg-muted/50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Notification Preferences</h3>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-muted-foreground mb-3">Notification Types</p>
                        <div className="space-y-2">
                          {[
                            { key: 'eventStatus', label: 'Event status updates' },
                            { key: 'approvalRequests', label: 'Approval requests' },
                            { key: 'commentsFeedback', label: 'Comments & feedback' },
                            { key: 'systemAnnouncements', label: 'System announcements' },
                          ].map((item) => (
                            <label key={item.key} className="flex items-center gap-2 text-sm">
                              <input
                                type="checkbox"
                                checked={formData.notificationTypes[item.key as keyof typeof formData.notificationTypes]}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  notificationTypes: {
                                    ...formData.notificationTypes,
                                    [item.key]: e.target.checked
                                  }
                                })}
                                className="rounded border-border"
                              />
                              {item.label}
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground mb-3">Delivery Channels</p>
                        <div className="space-y-2">
                          {[
                            { key: 'sms', label: 'sms' },
                            { key: 'email', label: 'email' },
                          ].map((item) => (
                            <label key={item.key} className="flex items-center gap-2 text-sm">
                              <input
                                type="checkbox"
                                checked={formData.deliveryChannels[item.key as keyof typeof formData.deliveryChannels]}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  deliveryChannels: {
                                    ...formData.deliveryChannels,
                                    [item.key]: e.target.checked
                                  }
                                })}
                                className="rounded border-border"
                              />
                              {item.label}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }

              {/* Security */}
              <div className="bg-muted/50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Security</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Password Management</p>
                      <p className="text-sm text-muted-foreground">Last password change: January 15, 2025</p>
                    </div>
                    <button type="button" className="text-sm text-primary underline">
                      Manage security settings
                    </button>
                  </div>
                  
                  <div className="border-t border-border pt-4">
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground mb-2">
                      Add an extra layer of security to your account
                    </p>
                    <button type="button" className="text-sm text-primary underline">
                      Enable 2FA
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-8 py-3 border border-border rounded-lg font-medium hover:bg-muted transition-colors"
                >
                  cancle
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-foreground text-background rounded-lg font-medium hover:bg-foreground/90 transition-colors"
                >
                  Update profile
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default Profile;