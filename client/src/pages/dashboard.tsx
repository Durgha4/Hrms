import { useMe, useLogout } from "@/hooks/use-auth";
import { useLocation, Redirect } from "wouter";
import { LogOut, User as UserIcon, LayoutDashboard, Settings, Bell, ChevronRight } from "lucide-react";
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
    <div className="min-h-screen bg-slate-50">
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 font-display">
              Welcome back, <span className="capitalize text-primary">{user.role}</span>!
            </h1>
            <p className="text-slate-500 mt-2">Manage your account and access your resources.</p>
          </div>
          
          <Button 
            variant="outline" 
            className="border-slate-200 text-slate-600 hover:bg-slate-100 font-medium"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            <LogOut className="w-4 h-4 mr-2" />
            {logoutMutation.isPending ? "Signing out..." : "Sign Out"}
          </Button>
        </div>

        {/* Dashboard Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Quick Action Card 1 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group cursor-pointer">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Overview</h3>
            <p className="text-sm text-slate-500 mb-4 line-clamp-2">
              View your daily summaries, pending tasks, and recent activities in one place.
            </p>
            <div className="flex items-center text-primary text-sm font-semibold group-hover:underline underline-offset-2">
              Go to Overview <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>

          {/* Quick Action Card 2 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group cursor-pointer">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <UserIcon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Profile Details</h3>
            <p className="text-sm text-slate-500 mb-4 line-clamp-2">
              Update your personal information, contact details, and preferences.
            </p>
            <div className="flex items-center text-purple-600 text-sm font-semibold group-hover:underline underline-offset-2">
              Manage Profile <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>

          {/* Quick Action Card 3 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group cursor-pointer">
            <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Settings className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Account Settings</h3>
            <p className="text-sm text-slate-500 mb-4 line-clamp-2">
              Configure your security settings, notifications, and system preferences.
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
