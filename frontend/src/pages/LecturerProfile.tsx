import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";

const LecturerProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "john",
    position: "Deputy Director",
    notificationTypes: {
      eventStatus: false,
      approvalRequests: false,
      commentsFeedback: false,
    },
    deliveryChannels: {
      sms: false,
      email: false,
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/approval-dashboard");
  };

  return (
    <MainLayout title="My Profile" subtitle="Manage your account information and preferences">
      <div className="container mx-auto px-6 pb-12">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Profile Info */}
              <div className="bg-white/90 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-3xl">👤</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{formData.fullName}</h3>
                    <p className="text-sm text-muted-foreground">{formData.position}</p>
                  </div>
                </div>
              </div>

              {/* Notification Preferences */}
              <div className="bg-muted/50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Notification Preferences</h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-3">Notification Types</p>
                    <div className="space-y-2">
                      {[
                        { key: 'eventStatus', label: 'Event status updates' },
                        { key: 'approvalRequests', label: 'Approval requests' },
                        { key: 'commentsFeedback', label: 'Comments & feedback' },
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
                    <div className="flex gap-4">
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
            </div>

            {/* Right Column - Security */}
            <div className="space-y-6">
              <div className="bg-muted/50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Security</h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="font-medium">Password Management</p>
                    <p className="text-sm text-muted-foreground mb-2">Manage security settings</p>
                    <p className="text-sm text-muted-foreground">Last password change: January 15, 2025</p>
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

export default LecturerProfile;
