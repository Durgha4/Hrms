import { useMe, useLogout } from "@/hooks/use-auth";
import { useLocation, Redirect } from "wouter";
import { LogOut, Mail, Phone, AlertCircle, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";

export default function Profile() {
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

  const firstName = user.firstName || user.email.split("@")[0];
  const lastName = user.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim();

  return (
    <DashboardLayout title="Profile">
      <div className="max-w-7xl">
        {/* Profile Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 font-display">Profile</h1>
            <p className="text-slate-600 mt-2">View and manage your profile information</p>
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

        {/* Profile Summary Card */}
        <div className="bg-white rounded-2xl p-8 shadow-sm mb-8" style={{ borderRadius: "16px", padding: "32px" }}>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={fullName}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <UserIcon className="w-16 h-16 text-primary/40" />
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-grow">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">{fullName}</h2>
              <p className="text-lg text-primary font-semibold capitalize mb-4">{user.role}</p>
              <p className="text-slate-600 text-sm">Employee ID: {user.id}</p>
            </div>
          </div>
        </div>

        {/* Basic Details Section */}
        <div className="bg-white rounded-2xl p-8 shadow-sm mb-8" style={{ borderRadius: "16px", padding: "32px" }}>
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Basic Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs uppercase font-semibold text-slate-500 block mb-2">Employee ID</label>
              <p className="text-slate-900 font-medium">{user.id}</p>
            </div>
            <div>
              <label className="text-xs uppercase font-semibold text-slate-500 block mb-2">First Name</label>
              <p className="text-slate-900 font-medium">{firstName}</p>
            </div>
            <div>
              <label className="text-xs uppercase font-semibold text-slate-500 block mb-2">Last Name</label>
              <p className="text-slate-900 font-medium">{lastName || "-"}</p>
            </div>
            <div>
              <label className="text-xs uppercase font-semibold text-slate-500 block mb-2">Date of Joining</label>
              <p className="text-slate-900 font-medium">{user.dateOfJoining || "-"}</p>
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="bg-white rounded-2xl p-8 shadow-sm" style={{ borderRadius: "16px", padding: "32px" }}>
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Contact Information</h3>
          <div className="space-y-6">
            {/* Official Email */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Mail className="w-5 h-5 text-primary mt-1" />
              </div>
              <div className="flex-grow">
                <label className="text-xs uppercase font-semibold text-slate-500 block mb-1">Official Email</label>
                <p className="text-slate-900 font-medium">{user.email}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Phone className="w-5 h-5 text-primary mt-1" />
              </div>
              <div className="flex-grow">
                <label className="text-xs uppercase font-semibold text-slate-500 block mb-1">Phone</label>
                <p className="text-slate-900 font-medium">{user.phone || "-"}</p>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-primary mt-1" />
              </div>
              <div className="flex-grow">
                <label className="text-xs uppercase font-semibold text-slate-500 block mb-1">Emergency Contact</label>
                <p className="text-slate-900 font-medium">{user.emergencyContact || "-"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
