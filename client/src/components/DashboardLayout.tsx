import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import DashboardNavbar from "./DashboardNavbar";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
}

export default function DashboardLayout({ children, title = "Profile" }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-100">
      <DashboardNavbar title={title} />
      <Sidebar />

      {/* Main Content Area */}
      <main className="ml-20 mt-16">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
