import { useMe } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardNavbarProps {
  title?: string;
}

export default function DashboardNavbar({ title = "Profile" }: DashboardNavbarProps) {
  const { data: user } = useMe();

  const getInitials = (email?: string) => {
    if (!email) return "U";
    return email.split("@")[0].slice(0, 2).toUpperCase();
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-blue-900 to-blue-800 border-b border-blue-950 z-40 flex items-center">
      <div className="flex-1 flex items-center justify-between px-8">
        {/* Left Side - Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-yellow-400 rounded-md flex items-center justify-center">
            <span className="text-blue-900 font-bold text-lg">X</span>
          </div>
          <h1 className="text-white font-bold text-lg">{title}</h1>
        </div>

        {/* Right Side - Notifications & Avatar */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-blue-700 rounded-full"
          >
            <Bell className="w-5 h-5" />
          </Button>

          <div className="h-6 w-px bg-blue-700" />

          <div className="w-9 h-9 bg-white text-blue-900 rounded-full flex items-center justify-center font-semibold text-sm">
            {getInitials(user?.email)}
          </div>
        </div>
      </div>
    </header>
  );
}
