import { useMe } from "@/hooks/use-auth";
import { Redirect } from "wouter";

export default function Dashboard() {
  const { data: user, isLoading } = useMe();

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

  return (
    <div className="min-h-screen bg-white">
      <div className="px-6 py-6">
        <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
      </div>
    </div>
  );
}
