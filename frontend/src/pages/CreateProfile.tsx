import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { AlertCircle } from "lucide-react";

const CreateProfile = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const roles = [
    { id: "organizer", label: "Organizer" },
    { id: "student", label: "user /student" },
    { id: "lecturer", label: "lecture" },
  ];

  const handleNext = () => {
    if (selectedRole === "organizer") {
      navigate("/profile/organizer");
    } else if (selectedRole === "student") {
      navigate("/profile/student");
    } else if (selectedRole === "lecturer") {
      navigate("/profile/lecturer");
    }
  };

  return (
    <MainLayout title="Create profile" subtitle="Manage your account information and preferences">
      <div className="container mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Role Selection Card */}
          <div className="card-white">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <span className="text-3xl">👤</span>
              </div>
            </div>

            <div className="mb-6">
              <div className="form-select bg-muted/50 cursor-pointer">
                select role
              </div>
            </div>

            <div className="space-y-4">
              {roles.map((role) => (
                <label 
                  key={role.id}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedRole === role.id}
                    onChange={() => setSelectedRole(role.id)}
                    className="w-5 h-5 rounded border-border"
                  />
                  <span className="text-foreground">{role.label}</span>
                </label>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <button 
                onClick={handleNext}
                disabled={!selectedRole}
                className="px-8 py-3 bg-foreground text-background rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                next
              </button>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-white/90 rounded-2xl p-8 flex items-start gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-foreground flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <p className="text-foreground text-lg">
              "after create a lecturer and organizer account, you need to wait for admin approval."
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CreateProfile;
