import { useState } from "react";
import { useMe, useLogout } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { ChevronDown, Edit2, Plus, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Profile() {
  const { data: user, isLoading } = useMe();
  const logoutMutation = useLogout();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    firstName: "Durgha",
    lastName: "S",
    employeeId: "Durgha S",
    dateOfJoining: "-",
    dateOfBirth: "-",
    nationality: "-",
    maritalStatus: "-",
    religion: "-",
    address: "-",
    city: "-",
    state: "-",
    pinCode: "-",
    country: "-",
    workLocation: "-",
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/" />;
  }

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleEditSave = () => {
    setEditingSection(null);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const sidebarItems = [
    { icon: "👤", label: "Profile", active: true },
    { icon: "⏱️", label: "Timesheet" },
    { icon: "📋", label: "Leave Request" },
    { icon: "📦", label: "Assets" },
    { icon: "📜", label: "Policy" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 bg-[#0F3D57]" style={{ height: "64px" }}>
        <div className="flex items-center gap-2">
          <img
            src="https://media.licdn.com/dms/image/v2/D560BAQGcR7_HwEkKmA/company-logo_200_200/company-logo_200_200/0/1699232615152/novintix_logo?e=2147483647&v=beta&t=3XAk48qckTMdWC62Op9WZpvM-tYNKPth5DU6yrYIk60"
            alt="Logo"
            className="w-8 h-8"
          />
          <span className="text-white font-semibold text-lg">Profile</span>
        </div>

        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-white text-[#0F3D57] font-semibold text-sm"
          >
            DS
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 py-2">
              <div className="px-4 py-2 border-b text-sm">
                <p className="text-gray-700"><strong>Role:</strong> {user.role}</p>
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setDropdownOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2 text-sm"
                disabled={logoutMutation.isPending}
              >
                <LogOut className="w-4 h-4" />
                {logoutMutation.isPending ? "Logging out..." : "Logout"}
              </button>
            </div>
          )}
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-14 bg-gray-200 border-r border-gray-300 py-4 flex flex-col items-center gap-6">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              className={`p-3 rounded-lg transition text-center flex flex-col items-center justify-center ${
                item.active ? "bg-gray-400 text-gray-800" : "text-gray-600 hover:bg-gray-300"
              }`}
              title={item.label}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-xs mt-1 font-semibold">{item.label}</span>
            </button>
          ))}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT COLUMN */}
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="h-24 bg-gradient-to-r from-cyan-400 to-cyan-600"></div>
                <div className="px-6 pb-6 flex flex-col items-center">
                  <div className="-mt-12 mb-4">
                    <img
                      src="https://media.licdn.com/dms/image/v2/D560BAQGcR7_HwEkKmA/company-logo_200_200/company-logo_200_200/0/1699232615152/novintix_logo?e=2147483647&v=beta&t=3XAk48qckTMdWC62Op9WZpvM-tYNKPth5DU6yrYIk60"
                      alt="Profile"
                      className="w-20 h-20 rounded-full border-4 border-white shadow-lg bg-white p-1"
                    />
                  </div>
                  <h2 className="text-lg font-bold text-gray-800">Durgha S</h2>
                  <p className="text-cyan-600 text-sm font-semibold mt-1">AI - Developer</p>
                </div>
              </div>

              {/* Resume Card */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 012-2h6a1 1 0 01.894.553l2 4H4V4z" />
                    </svg>
                    <span className="font-semibold text-gray-800">Resume</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M11 3a1 1 0 100 2h3.414l-5.293 5.293a1 1 0 001.414 1.414L15.828 6.414V9.828a1 1 0 100 2h-5a1 1 0 01-1-1V4z" />
                      </svg>
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 17a1 1 0 011-1h12a1 1 0 011 1v2H3v-2zm3-7a1 1 0 110-2h6a1 1 0 110 2H6z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Basic Details */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="font-bold text-gray-800 text-sm">Basic Details</h3>
                  <button
                    onClick={() => setEditingSection(editingSection === "basic" ? null : "basic")}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Edit2 className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                <div className="p-4 space-y-4">
                  {editingSection === "basic" ? (
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs uppercase text-gray-500 font-semibold">Employee ID</label>
                        <Input
                          value={formData.employeeId}
                          onChange={(e) => handleInputChange("employeeId", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs uppercase text-gray-500 font-semibold">First Name</label>
                          <Input
                            value={formData.firstName}
                            onChange={(e) => handleInputChange("firstName", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-xs uppercase text-gray-500 font-semibold">Last Name</label>
                          <Input
                            value={formData.lastName}
                            onChange={(e) => handleInputChange("lastName", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <button
                        onClick={handleEditSave}
                        className="w-full bg-blue-600 text-white py-2 rounded text-sm font-semibold hover:bg-blue-700"
                      >
                        Save Changes
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2 text-xs">
                      <div>
                        <p className="uppercase text-gray-500 font-semibold">Employee ID</p>
                        <p className="text-gray-800">{formData.employeeId}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="uppercase text-gray-500 font-semibold">First Name</p>
                          <p className="text-gray-800">{formData.firstName}</p>
                        </div>
                        <div>
                          <p className="uppercase text-gray-500 font-semibold">Last Name</p>
                          <p className="text-gray-800">{formData.lastName}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="uppercase text-gray-500 font-semibold">Date of Joining</p>
                          <p className="text-gray-800">{formData.dateOfJoining}</p>
                        </div>
                        <div>
                          <p className="uppercase text-gray-500 font-semibold">Date of Birth</p>
                          <p className="text-gray-800">{formData.dateOfBirth}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="uppercase text-gray-500 font-semibold">Nationality</p>
                          <p className="text-gray-800">{formData.nationality}</p>
                        </div>
                        <div>
                          <p className="uppercase text-gray-500 font-semibold">Marital Status</p>
                          <p className="text-gray-800">{formData.maritalStatus}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* CENTER COLUMN */}
            <div className="space-y-6">
              {/* About Employee */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="font-bold text-gray-800">About Employee</h3>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Edit2 className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-gray-600 text-sm">-</p>
                </div>
              </div>

              {/* Address Details */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="font-bold text-gray-800">Address Details</h3>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Edit2 className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <div className="p-4 space-y-3 text-xs">
                  <div>
                    <p className="uppercase text-gray-500 font-semibold">Address</p>
                    <p className="text-gray-600">{formData.address}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="uppercase text-gray-500 font-semibold">City</p>
                      <p className="text-gray-600">{formData.city}</p>
                    </div>
                    <div>
                      <p className="uppercase text-gray-500 font-semibold">State</p>
                      <p className="text-gray-600">{formData.state}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="uppercase text-gray-500 font-semibold">PIN Code</p>
                      <p className="text-gray-600">{formData.pinCode}</p>
                    </div>
                    <div>
                      <p className="uppercase text-gray-500 font-semibold">Country</p>
                      <p className="text-gray-600">{formData.country}</p>
                    </div>
                  </div>
                  <div>
                    <p className="uppercase text-gray-500 font-semibold">Work Location</p>
                    <p className="text-gray-600">{formData.workLocation}</p>
                  </div>
                </div>
              </div>

              {/* Identification Documents */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-4 border-b">
                  <h3 className="font-bold text-gray-800">Identification Documents</h3>
                </div>
                <div className="p-4 space-y-3 text-xs">
                  <div>
                    <p className="uppercase text-gray-500 font-semibold">National Identity Card Type</p>
                    <p className="text-gray-600">-</p>
                  </div>
                  <div>
                    <p className="uppercase text-gray-500 font-semibold">National ID Upload</p>
                    <p className="text-gray-600">Read-only</p>
                  </div>
                  <div>
                    <p className="uppercase text-gray-500 font-semibold">National Identity Number</p>
                    <p className="text-gray-600">-</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              {/* Skills & Expertise */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="font-bold text-gray-800">Skills & Expertise</h3>
                  <button className="px-2 py-1 bg-cyan-600 text-white text-xs rounded flex items-center gap-1 hover:bg-cyan-700">
                    <Plus className="w-3 h-3" />
                    Add
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-gray-600 text-sm">-</p>
                </div>
              </div>

              {/* Banking Details */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="font-bold text-gray-800">Banking Details</h3>
                </div>
                <div className="p-4 space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="uppercase text-gray-500 font-semibold">Bank Name</p>
                      <p className="text-gray-600">-</p>
                    </div>
                    <div>
                      <p className="uppercase text-gray-500 font-semibold">Account Number</p>
                      <p className="text-gray-600">-</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="uppercase text-gray-500 font-semibold">Account Type</p>
                      <p className="text-gray-600">-</p>
                    </div>
                    <div>
                      <p className="uppercase text-gray-500 font-semibold">IFSC Code</p>
                      <p className="text-gray-600">-</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="uppercase text-gray-500 font-semibold">Swift Code</p>
                      <p className="text-gray-600">-</p>
                    </div>
                    <div>
                      <p className="uppercase text-gray-500 font-semibold">Branch Name</p>
                      <p className="text-gray-600">-</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Passport Details */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="font-bold text-gray-800">Passport Details</h3>
                </div>
                <div className="p-4 space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="uppercase text-gray-500 font-semibold">Do You Have Passport?</p>
                      <p className="text-gray-600">-</p>
                    </div>
                    <div>
                      <p className="uppercase text-gray-500 font-semibold">Passport Number</p>
                      <p className="text-gray-600">-</p>
                    </div>
                  </div>
                  <div>
                    <p className="uppercase text-gray-500 font-semibold">Passport Expiry Date</p>
                    <p className="text-gray-600">-</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
