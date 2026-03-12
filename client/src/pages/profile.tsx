import { useState } from "react";
import { useMe } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Edit2, User as UserIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/DashboardLayout";

export default function Profile() {
  const { data: user, isLoading } = useMe();
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    employeeId: "EMP001",
    dateOfJoining: "2023-01-15",
    aboutEmployee: "Dedicated professional with expertise in full-stack development",
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/" />;
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEditSave = (section: string) => {
    setEditingSection(null);
  };

  const firstName = user.firstName || "John";
  const lastName = user.lastName || "Doe";
  const fullName = `${firstName} ${lastName}`;

  return (
    <DashboardLayout title="Profile">
      <div className="max-w-6xl">
        {/* Profile Summary Card */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Profile Summary</h2>
            <button
              onClick={() => setEditingSection(editingSection === "summary" ? null : "summary")}
              className="p-2 hover:bg-slate-100 rounded-lg"
              title="Edit profile"
            >
              <Edit2 className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          <div className="flex items-center gap-6">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={fullName}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <UserIcon className="w-12 h-12 text-primary/40" />
                )}
              </div>
            </div>

            {/* Profile Info */}
            {editingSection === "summary" ? (
              <div className="flex-grow space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase font-semibold text-slate-500 block mb-2">First Name</label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase font-semibold text-slate-500 block mb-2">Last Name</label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>
                <button
                  onClick={() => handleEditSave("summary")}
                  className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90"
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-2xl font-bold text-slate-900">{fullName}</h3>
                <p className="text-primary font-semibold capitalize mt-1">{user.role}</p>
                <p className="text-slate-600 text-sm mt-2">Employee ID: {user.id}</p>
              </div>
            )}
          </div>
        </div>

        {/* Basic Details Card */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">Basic Details</h3>
            <button
              onClick={() => setEditingSection(editingSection === "basic" ? null : "basic")}
              className="p-2 hover:bg-slate-100 rounded-lg"
              title="Edit basic details"
            >
              <Edit2 className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {editingSection === "basic" ? (
            <div className="space-y-4">
              <div>
                <label className="text-xs uppercase font-semibold text-slate-500 block mb-2">Employee ID</label>
                <Input
                  value={formData.employeeId}
                  onChange={(e) => handleInputChange("employeeId", e.target.value)}
                  className="text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase font-semibold text-slate-500 block mb-2">First Name</label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase font-semibold text-slate-500 block mb-2">Last Name</label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className="text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs uppercase font-semibold text-slate-500 block mb-2">Date of Joining</label>
                <Input
                  value={formData.dateOfJoining}
                  onChange={(e) => handleInputChange("dateOfJoining", e.target.value)}
                  className="text-sm"
                />
              </div>
              <button
                onClick={() => handleEditSave("basic")}
                className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <label className="text-xs uppercase font-semibold text-slate-500 block mb-2">Employee ID</label>
                <p className="text-slate-900 font-medium">{formData.employeeId}</p>
              </div>
              <div>
                <label className="text-xs uppercase font-semibold text-slate-500 block mb-2">First Name</label>
                <p className="text-slate-900 font-medium">{formData.firstName}</p>
              </div>
              <div>
                <label className="text-xs uppercase font-semibold text-slate-500 block mb-2">Last Name</label>
                <p className="text-slate-900 font-medium">{formData.lastName}</p>
              </div>
              <div>
                <label className="text-xs uppercase font-semibold text-slate-500 block mb-2">Date of Joining</label>
                <p className="text-slate-900 font-medium">{formData.dateOfJoining}</p>
              </div>
            </div>
          )}
        </div>

        {/* About Employee Card */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">About Employee</h3>
            <button
              onClick={() => setEditingSection(editingSection === "about" ? null : "about")}
              className="p-2 hover:bg-slate-100 rounded-lg"
              title="Edit about"
            >
              <Edit2 className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {editingSection === "about" ? (
            <div className="space-y-4">
              <div>
                <label className="text-xs uppercase font-semibold text-slate-500 block mb-2">About</label>
                <textarea
                  value={formData.aboutEmployee}
                  onChange={(e) => handleInputChange("aboutEmployee", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={4}
                />
              </div>
              <button
                onClick={() => handleEditSave("about")}
                className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <p className="text-slate-600">{formData.aboutEmployee || "No information added yet"}</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
