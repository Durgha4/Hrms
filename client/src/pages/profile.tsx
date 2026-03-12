import { useState } from "react";
import { useMe } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Edit2, Plus, Download, Share2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import Sidebar from "@/components/Sidebar";
import DashboardNavbar from "@/components/DashboardNavbar";

export default function Profile() {
  const { data: user, isLoading } = useMe();
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEditSave = () => {
    setEditingSection(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar title="Profile" />
      <Sidebar />

      {/* Main Content */}
      <main className="ml-56 pt-20 pb-8 px-8">
        <div className="grid grid-cols-3 gap-6">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="h-24 bg-gradient-to-r from-cyan-400 to-cyan-600"></div>
              <div className="px-6 pb-6 flex flex-col items-center">
                <div className="-mt-12 mb-4">
                  <div className="w-20 h-20 rounded-full border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center">
                    <img
                      src="https://media.licdn.com/dms/image/v2/D560BAQGcR7_HwEkKmA/company-logo_200_200/company-logo_200_200/0/1699232615152/novintix_logo?e=2147483647&v=beta&t=3XAk48qckTMdWC62Op9WZpvM-tYNKPth5DU6yrYIk60"
                      alt="Profile"
                      className="w-16 h-16 object-cover"
                    />
                  </div>
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
                  <span className="font-semibold text-gray-800 text-sm">Resume</span>
                </div>
                <div className="flex gap-2">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Share2 className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Download className="w-4 h-4 text-gray-600" />
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

              <div className="p-4 space-y-3">
                {editingSection === "basic" ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs uppercase text-gray-500 font-semibold block mb-1">Employee ID</label>
                      <Input
                        value={formData.employeeId}
                        onChange={(e) => handleInputChange("employeeId", e.target.value)}
                        className="text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs uppercase text-gray-500 font-semibold block mb-1">First Name</label>
                        <Input
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase text-gray-500 font-semibold block mb-1">Last Name</label>
                        <Input
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          className="text-sm"
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
                  <div className="text-xs space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="uppercase text-gray-500 font-semibold">Employee ID</p>
                        <p className="text-gray-800">{formData.employeeId}</p>
                      </div>
                      <div>
                        <p className="uppercase text-gray-500 font-semibold">First Name</p>
                        <p className="text-gray-800">{formData.firstName}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="uppercase text-gray-500 font-semibold">Last Name</p>
                        <p className="text-gray-800">{formData.lastName}</p>
                      </div>
                      <div>
                        <p className="uppercase text-gray-500 font-semibold">Date of Joining</p>
                        <p className="text-gray-800">{formData.dateOfJoining}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="uppercase text-gray-500 font-semibold">Nationality</p>
                        <p className="text-gray-800">{formData.nationality}</p>
                      </div>
                      <div>
                        <p className="uppercase text-gray-500 font-semibold">Date of Birth</p>
                        <p className="text-gray-800">{formData.dateOfBirth}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="uppercase text-gray-500 font-semibold">Marital Status</p>
                        <p className="text-gray-800">{formData.maritalStatus}</p>
                      </div>
                      <div>
                        <p className="uppercase text-gray-500 font-semibold">Religion</p>
                        <p className="text-gray-800">{formData.religion}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* MIDDLE COLUMN */}
          <div className="space-y-6">
            {/* About Employee */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-bold text-gray-800 text-sm">About Employee</h3>
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
                <h3 className="font-bold text-gray-800 text-sm">Address Details</h3>
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
                <h3 className="font-bold text-gray-800 text-sm">Identification Documents</h3>
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
                <h3 className="font-bold text-gray-800 text-sm">Skills & Expertise</h3>
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
              <div className="p-4 border-b">
                <h3 className="font-bold text-gray-800 text-sm">Banking Details</h3>
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
              <div className="p-4 border-b">
                <h3 className="font-bold text-gray-800 text-sm">Passport Details</h3>
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
  );
}
