import { useState } from "react";
import { useMe } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Edit2, Upload, Download, User as UserIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/DashboardLayout";

interface BasicDetails {
  employeeId: string;
  firstName: string;
  lastName: string;
  dateOfJoining: string;
  nationality: string;
  dateOfBirth: string;
  maritalStatus: string;
  religion: string;
}

interface ContactInfo {
  officialEmail: string;
  mobileNumber: string;
  personalEmail: string;
  emergencyContact: string;
}

export default function Profile() {
  const { data: user, isLoading } = useMe();
  const [editingSection, setEditingSection] = useState<string | null>(null);

  const [basicDetails, setBasicDetails] = useState<BasicDetails>({
    employeeId: "EMP-2024-001",
    firstName: "Durgha",
    lastName: "S",
    dateOfJoining: "2024-01-15",
    nationality: "Indian",
    dateOfBirth: "1998-06-20",
    maritalStatus: "Single",
    religion: "Hindu",
  });

  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    officialEmail: "durgha.s@company.com",
    mobileNumber: "+91 98765 43210",
    personalEmail: "durgha.s@gmail.com",
    emergencyContact: "+91 91234 56789",
  });

  const [basicDraft, setBasicDraft] = useState<BasicDetails>({ ...basicDetails });
  const [contactDraft, setContactDraft] = useState<ContactInfo>({ ...contactInfo });

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

  const handleEditStart = (section: string) => {
    if (section === "basic") setBasicDraft({ ...basicDetails });
    if (section === "contact") setContactDraft({ ...contactInfo });
    setEditingSection(section);
  };

  const handleSave = (section: string) => {
    if (section === "basic") setBasicDetails({ ...basicDraft });
    if (section === "contact") setContactInfo({ ...contactDraft });
    setEditingSection(null);
  };

  const handleCancel = () => setEditingSection(null);

  return (
    <DashboardLayout title="Employee Profile">
      <div className="flex gap-6 max-w-6xl">

        {/* Left Column */}
        <div className="flex flex-col gap-6 w-80 flex-shrink-0">

          {/* 1. Profile Card */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* Blue Banner */}
            <div className="h-24 w-full" style={{ background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)" }} />
            {/* Avatar overlapping banner */}
            <div className="flex flex-col items-center -mt-12 pb-6 px-6">
              <div className="w-20 h-20 rounded-full border-4 border-white bg-slate-200 flex items-center justify-center shadow-md overflow-hidden">
                {user.profileImage ? (
                  <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-10 h-10 text-slate-400" />
                )}
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-3">Durgha S</h2>
              <span
                className="mt-2 px-3 py-1 rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: "#1e40af" }}
              >
                AI - Developer
              </span>
            </div>
          </div>

          {/* 2. Resume Card */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-800 mb-4">Resume</h3>
            <div className="flex flex-col gap-3">
              {/* Upload Area */}
              <label className="flex items-center gap-3 border-2 border-dashed border-slate-200 rounded-xl p-4 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors group">
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100">
                  <Upload className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Upload Resume</p>
                  <p className="text-xs text-slate-400">PDF, DOC up to 5MB</p>
                </div>
                <input type="file" className="hidden" accept=".pdf,.doc,.docx" />
              </label>
              {/* Download Button */}
              <button className="flex items-center gap-3 border border-slate-200 rounded-xl p-4 hover:bg-slate-50 transition-colors group">
                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-slate-200">
                  <Download className="w-4 h-4 text-slate-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-700">Download Resume</p>
                  <p className="text-xs text-slate-400">Download current resume</p>
                </div>
              </button>
            </div>
          </div>

          {/* 3. Basic Details Card */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800">Basic Details</h3>
              {editingSection !== "basic" && (
                <button
                  onClick={() => handleEditStart("basic")}
                  className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Edit basic details"
                >
                  <Edit2 className="w-4 h-4 text-slate-500" />
                </button>
              )}
            </div>

            {editingSection === "basic" ? (
              <div className="space-y-3">
                {(
                  [
                    ["employeeId", "Employee ID"],
                    ["firstName", "First Name"],
                    ["lastName", "Last Name"],
                    ["dateOfJoining", "Date of Joining"],
                    ["nationality", "Nationality"],
                    ["dateOfBirth", "Date of Birth"],
                    ["maritalStatus", "Marital Status"],
                    ["religion", "Religion"],
                  ] as [keyof BasicDetails, string][]
                ).map(([field, label]) => (
                  <div key={field}>
                    <label className="text-xs font-semibold text-slate-500 block mb-1">{label}</label>
                    <Input
                      value={basicDraft[field]}
                      onChange={(e) => setBasicDraft(prev => ({ ...prev, [field]: e.target.value }))}
                      className="text-xs h-8"
                    />
                  </div>
                ))}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => handleSave("basic")}
                    className="flex-1 bg-blue-700 text-white py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-800 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 border border-slate-300 text-slate-600 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {(
                  [
                    ["Employee ID", basicDetails.employeeId],
                    ["First Name", basicDetails.firstName],
                    ["Last Name", basicDetails.lastName],
                    ["Date of Joining", basicDetails.dateOfJoining],
                    ["Nationality", basicDetails.nationality],
                    ["Date of Birth", basicDetails.dateOfBirth],
                    ["Marital Status", basicDetails.maritalStatus],
                    ["Religion", basicDetails.religion],
                  ] as [string, string][]
                ).map(([label, value]) => (
                  <div key={label} className="flex items-start justify-between gap-2">
                    <span className="text-xs text-slate-500 flex-shrink-0 w-28">{label}</span>
                    <span className="text-xs font-semibold text-slate-800 text-right">{value || "—"}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 4. Contact Information Card */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800">Contact Information</h3>
              {editingSection !== "contact" && (
                <button
                  onClick={() => handleEditStart("contact")}
                  className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Edit contact info"
                >
                  <Edit2 className="w-4 h-4 text-slate-500" />
                </button>
              )}
            </div>

            {editingSection === "contact" ? (
              <div className="space-y-3">
                {(
                  [
                    ["officialEmail", "Official Email ID"],
                    ["mobileNumber", "Mobile Number"],
                    ["personalEmail", "Personal Email ID"],
                    ["emergencyContact", "Emergency Contact"],
                  ] as [keyof ContactInfo, string][]
                ).map(([field, label]) => (
                  <div key={field}>
                    <label className="text-xs font-semibold text-slate-500 block mb-1">{label}</label>
                    <Input
                      value={contactDraft[field]}
                      onChange={(e) => setContactDraft(prev => ({ ...prev, [field]: e.target.value }))}
                      className="text-xs h-8"
                    />
                  </div>
                ))}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => handleSave("contact")}
                    className="flex-1 bg-blue-700 text-white py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-800 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 border border-slate-300 text-slate-600 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {(
                  [
                    ["Official Email ID", contactInfo.officialEmail],
                    ["Mobile Number", contactInfo.mobileNumber],
                    ["Personal Email ID", contactInfo.personalEmail],
                    ["Emergency Contact", contactInfo.emergencyContact],
                  ] as [string, string][]
                ).map(([label, value]) => (
                  <div key={label} className="flex items-start justify-between gap-2">
                    <span className="text-xs text-slate-500 flex-shrink-0 w-28">{label}</span>
                    <span className="text-xs font-semibold text-slate-800 text-right break-all">{value || "—"}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column — reserved for future cards */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center justify-center min-h-40">
            <p className="text-slate-400 text-sm">More sections coming soon</p>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
