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
    <aside className="fixed left-0 top-0 h-screen w-56 bg-slate-50 border-r border-slate-200 pt-16 flex flex-col">
      <nav className="flex-1 px-4 py-8 space-y-2">
        {modules.map((module) => {
          const Icon = module.icon;
          const isActive = location === module.path;

          return (
            <a
              key={module.name}
              href={module.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200",
                isActive
                  ? "bg-white text-primary shadow-sm border border-slate-200"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium text-sm">{module.name}</span>
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
