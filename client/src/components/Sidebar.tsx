import { useLocation } from "wouter";
import { User, FileText, Calendar, Briefcase, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const modules = [
  { name: "Profile", icon: User, path: "/profile" },
  { name: "Timesheet", icon: Calendar, path: "/timesheet" },
  { name: "Leave Request", icon: FileText, path: "/leave-request" },
  { name: "Assets", icon: Briefcase, path: "/assets" },
  { name: "Policy", icon: BookOpen, path: "/policy" },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-24 bg-slate-50 border-r border-slate-200 pt-16 flex flex-col items-center">
      <nav className="flex-1 flex flex-col items-center py-8 space-y-4">
        {modules.map((module) => {
          const Icon = module.icon;
          const isActive = location === module.path;

          return (
            <a
              key={module.name}
              href={module.path}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors duration-200 w-full",
                isActive
                  ? "bg-white text-primary shadow-sm border border-slate-200"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
              )}
              title={module.name}
            >
              <Icon className="w-6 h-6 flex-shrink-0" />
              <span className="text-xs font-semibold text-center text-slate-600 leading-tight">
                {module.name}
              </span>
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
