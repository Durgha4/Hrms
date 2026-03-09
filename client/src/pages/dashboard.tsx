import { useMe, useLogout } from "@/hooks/use-auth";
import { useLocation, Redirect } from "wouter";
import { LogOut, LayoutDashboard, User as UserIcon, Settings, Bell, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { data: user, isLoading } = useMe();
  const logoutMutation = useLogout();
  const [, setLocation] = useLocation();

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

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F7FA" }}>
      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm shadow-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-400 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-lg font-display">X</span>
              </div>
              <span className="font-display font-bold text-lg text-slate-800 hidden sm:block">HRMS Portal</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-700 rounded-full">
                <Bell className="w-5 h-5" />
              </Button>
              <div className="h-8 w-px bg-slate-200 mx-1"></div>
              <div className="flex items-center gap-3">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-medium text-slate-700 leading-none">{user.email}</p>
                  <p className="text-xs text-slate-500 mt-1 capitalize">{user.role}</p>
                </div>
                <div className="w-9 h-9 bg-primary/10 text-primary rounded-full flex items-center justify-center shadow-inner">
                  <UserIcon className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 font-display">
              Welcome back, <span className="text-primary capitalize">{user.role}</span>!
            </h1>
            <p className="text-slate-600 mt-3 text-base">Manage your account and access your resources.</p>
          </div>

          <Button
            variant="outline"
            className="border-slate-300 text-slate-700 hover:bg-white hover:border-slate-400"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            style={{ borderRadius: "8px" }}
          >
            <LogOut className="w-4 h-4 mr-2" />
            {logoutMutation.isPending ? "Signing out..." : "Sign Out"}
          </Button>
        </div>

        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ gap: "24px" }}>
          {/* Overview Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group cursor-pointer" style={{ borderRadius: "16px", padding: "24px" }}>
            <div className="w-12 h-12 bg-gray-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" style={{ borderRadius: "12px", width: "48px", height: "48px" }}>
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">Overview</h3>
            <p className="text-sm text-slate-600 mb-6">
              View daily summaries and recent activities.
            </p>
            <div className="flex items-center text-primary text-sm font-semibold group-hover:underline underline-offset-2">
              Go to Overview <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>

          {/* Profile Details Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group cursor-pointer" style={{ borderRadius: "16px", padding: "24px" }}>
            <div className="w-12 h-12 bg-gray-100 text-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" style={{ borderRadius: "12px", width: "48px", height: "48px" }}>
              <UserIcon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">Profile Details</h3>
            <p className="text-sm text-slate-600 mb-6">
              Update personal information and preferences.
            </p>
            <div className="flex items-center text-purple-600 text-sm font-semibold group-hover:underline underline-offset-2">
              Manage Profile <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>

          {/* Account Settings Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group cursor-pointer" style={{ borderRadius: "16px", padding: "24px" }}>
            <div className="w-12 h-12 bg-gray-100 text-slate-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" style={{ borderRadius: "12px", width: "48px", height: "48px" }}>
              <Settings className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">Account Settings</h3>
            <p className="text-sm text-slate-600 mb-6">
              Configure security and system preferences.
            </p>
            <div className="flex items-center text-slate-600 text-sm font-semibold group-hover:underline underline-offset-2">
              Open Settings <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
