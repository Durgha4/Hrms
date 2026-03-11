import { useState } from "react";
import { useMe, useLogout } from "@/hooks/use-auth";
import { useLocation, Redirect } from "wouter";
import { ChevronDown, Edit2, Plus, LogOut, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Profile() {
  const { data: user, isLoading } = useMe();
  const logoutMutation = useLogout();
  const [, setLocation] = useLocation();
  
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/" />;
  }

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      setLocation("/");
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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 bg-[#0F3D57]" style={{ height: "64px" }}>
        <div className="flex items-center">
          <img
            src="https://media.licdn.com/dms/image/v2/D560BAQGcR7_HwEkKmA/company-logo_200_200/company-logo_200_200/0/1699232615152/novintix_logo?e=2147483647&v=beta&t=3XAk48qckTMdWC62Op9WZpvM-tYNKPth5DU6yrYIk60"
            alt="Logo"
            style={{ width: "32px", height: "32px" }}
          />
          <span className="text-white font-semibold ml-2" style={{ fontSize: "18px" }}>
            Profile
          </span>
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center justify-center rounded-full text-[#0F3D57] font-semibold"
            style={{
              width: "36px",
              height: "36px",
              backgroundColor: "white",
            }}
          >
            DS
            <ChevronDown className="w-4 h-4 ml-1" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
              <div className="p-4 border-b border-gray-200">
                <p className="text-sm text-gray-700">
                  <strong>Role:</strong> {user.role}
                </p>
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setDropdownOpen(false);
                }}
                className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
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
        <aside className="w-16 bg-gray-200 border-r border-gray-300">
          <div className="flex flex-col items-center py-4 space-y-6">
            <button className="p-3 bg-gray-300 rounded-lg text-gray-700 hover:bg-gray-400">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </button>
            <button className="p-3 text-gray-600 hover:bg-gray-300 rounded-lg">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
              </svg>
            </button>
            <button className="p-3 text-gray-600 hover:bg-gray-300 rounded-lg">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" />
              </svg>
            </button>
            <button className="p-3 text-gray-600 hover:bg-gray-300 rounded-lg">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4z" />
              </svg>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="grid grid-cols-3 gap-6">
            {/* Left Column */}
            <div>
              {/* Profile Card */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                <div className="px-6 pb-6">
                  <div className="flex justify-center -mt-16 mb-4">
                    <img
                      src="https://media.licdn.com/dms/image/v2/D560BAQGcR7_HwEkKmA/company-logo_200_200/company-logo_200_200/0/1699232615152/novintix_logo?e=2147483647&v=beta&t=3XAk48qckTMdWC62Op9WZpvM-tYNKPth5DU6yrYIk60"
                      alt="Profile"
                      className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover bg-white"
                    />
                  </div>
                  <h2 className="text-center text-lg font-bold text-gray-800">Durgha S</h2>
                  <p className="text-center text-blue-600 text-sm mt-1">AI - Developer</p>
                </div>
              </div>

              {/* Resume Card */}
              <div className="bg-white rounded-lg shadow-sm p-4 mt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 012-2h6a1 1 0 01.894.553l2 4H4V4z" />
                      <path fillRule="evenodd" d="M3 12h14l1.447-2.894A1 1 0 0017 8H3v4zm0 2v2a2 2 0 002 2h10a2 2 0 002-2v-2H3z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold text-gray-800">Resume</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-1 text-gray-600 hover:bg-gray-100 rounded">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V9.414l-5.293 5.293a1 1 0 01-1.414-1.414L13.586 8H12z" />
                      </svg>
                    </button>
                    <button className="p-1 text-gray-600 hover:bg-gray-100 rounded">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Basic Details Card */}
              <div className="bg-white rounded-lg shadow-sm p-4 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800">Basic Details</h3>
                  <button
                    onClick={() => setEditingSection(editingSection === "basic" ? null : "basic")}
                    className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>

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
                    <button
                      onClick={handleEditSave}
                      className="w-full bg-blue-600 text-white py-2 rounded text-sm font-semibold hover:bg-blue-700"
                    >
                      Save Changes
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-xs uppercase text-gray-500 font-semibold">Employee ID</p>
                      <p className="text-gray-800">{formData.employeeId}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs uppercase text-gray-500 font-semibold">First Name</p>
                        <p className="text-gray-800">{formData.firstName}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase text-gray-500 font-semibold">Last Name</p>
                        <p className="text-gray-800">{formData.lastName}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-gray-500 font-semibold">Date of Joining</p>
                      <p className="text-gray-800">{formData.dateOfJoining}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs uppercase text-gray-500 font-semibold">Date of Birth</p>
                        <p className="text-gray-800">{formData.dateOfBirth}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase text-gray-500 font-semibold">Nationality</p>
                        <p className="text-gray-800">{formData.nationality}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Center Column */}
            <div className="space-y-6">
              {/* About Employee */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800">About Employee</h3>
                  <button className="p-1 text-gray-600 hover:bg-gray-100 rounded">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-gray-600 text-sm">-</p>
              </div>

              {/* Address Details */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800">Address Details</h3>
                  <button className="p-1 text-gray-600 hover:bg-gray-100 rounded">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-xs uppercase text-gray-500 font-semibold">Address</p>
                    <p className="text-gray-600">{formData.address}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs uppercase text-gray-500 font-semibold">City</p>
                      <p className="text-gray-600">{formData.city}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-gray-500 font-semibold">State</p>
                      <p className="text-gray-600">{formData.state}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Identification Documents */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800">Identification Documents</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-xs uppercase text-gray-500 font-semibold">National Identity Card Type</p>
                    <p className="text-gray-600">-</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-500 font-semibold">National ID Number</p>
                    <p className="text-gray-600">-</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Skills & Expertise */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800">Skills & Expertise</h3>
                  <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded flex items-center gap-1 hover:bg-blue-700">
                    <Plus className="w-3 h-3" />
                    Add
                  </button>
                </div>
                <p className="text-gray-600 text-sm">-</p>
              </div>

              {/* Banking Details */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800">Banking Details</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs uppercase text-gray-500 font-semibold">Bank Name</p>
                      <p className="text-gray-600">-</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-gray-500 font-semibold">Account Number</p>
                      <p className="text-gray-600">-</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs uppercase text-gray-500 font-semibold">Account Type</p>
                      <p className="text-gray-600">-</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-gray-500 font-semibold">IFSC Code</p>
                      <p className="text-gray-600">-</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Passport Details */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800">Passport Details</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs uppercase text-gray-500 font-semibold">Do You Have Passport?</p>
                      <p className="text-gray-600">-</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-gray-500 font-semibold">Passport Number</p>
                      <p className="text-gray-600">-</p>
                    </div>
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
