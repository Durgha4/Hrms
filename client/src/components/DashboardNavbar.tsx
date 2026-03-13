import { useState } from "react";
import { useMe, useLogout } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { LogOut } from "lucide-react";
import xLogo from "@assets/x_logo-removebg-preview_1773386473222.png";

interface DashboardNavbarProps {
  title?: string;
}

export default function DashboardNavbar({ title = "Profile" }: DashboardNavbarProps) {
  const { data: user } = useMe();
  const logoutMutation = useLogout();
  const [, setLocation] = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      setLocation("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#0F3D57] border-b border-blue-950 z-40 flex items-center">
      <div className="flex-1 flex items-center justify-between px-8">
        {/* Left Side - Logo & Title */}
        <div className="flex items-center gap-3 relative">
          <img
            src={xLogo}
            alt="X Logo"
            className="w-10 h-10 object-contain"
          />
          <h1 className="text-white font-bold text-lg">{title}</h1>
        </div>

        {/* Right Side - Avatar */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-9 h-9 bg-white text-[#0F3D57] rounded-full flex items-center justify-center font-semibold text-sm hover:shadow-md transition-shadow"
          >
            DS
          </button>

          {/* Profile Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 top-14 w-56 bg-white rounded-lg shadow-lg z-50 py-2">
              <div className="px-4 py-4 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-900">Durgha S</p>
                <p className="text-sm text-gray-600 mt-1">AI Developer</p>
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setDropdownOpen(false);
                }}
                className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 flex items-center gap-2 text-sm transition-colors"
                disabled={logoutMutation.isPending}
              >
                <LogOut className="w-4 h-4" />
                {logoutMutation.isPending ? "Logging out..." : "Logout"}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
