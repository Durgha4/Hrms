import { useState } from "react";
import { useMe } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { ChevronLeft, ChevronRight, Calendar, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";

interface Project {
  id: string;
  name: string;
  client: string;
  hours: {
    monday: number;
    tuesday: number;
    wednesday: number;
    thursday: number;
    friday: number;
    saturday: number;
    sunday: number;
  };
}

const clientData = {
  "NovintiX": ["AI - Internal", "Internal"],
};

/* ── Mini Calendar ─────────────────────────────────────── */
function MiniCalendar({ referenceDate }: { referenceDate: Date }) {
  const [viewDate, setViewDate] = useState(new Date(referenceDate));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const dayLabels = ["Su","Mo","Tu","We","Th","Fr","Sa"];

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const today = new Date();

  /* Get the Mon–Sun range of the reference week */
  const getWeekRange = (d: Date) => {
    const copy = new Date(d);
    const day = copy.getDay();
    const diff = copy.getDate() - day + (day === 0 ? -6 : 1);
    const mon = new Date(copy.setDate(diff));
    const sun = new Date(mon);
    sun.setDate(sun.getDate() + 6);
    return { mon, sun };
  };
  const { mon: weekMon, sun: weekSun } = getWeekRange(referenceDate);

  const isInCurrentWeek = (day: number) => {
    const d = new Date(year, month, day);
    return d >= weekMon && d <= weekSun;
  };

  const isToday = (day: number) => {
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
  };

  const cells: (number | null)[] = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div>
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => { const d = new Date(viewDate); d.setMonth(d.getMonth() - 1); setViewDate(d); }} className="p-1 hover:bg-slate-100 rounded-lg">
          <ChevronLeft className="w-4 h-4 text-slate-500" />
        </button>
        <span className="text-xs font-bold text-slate-700">{monthNames[month]} {year}</span>
        <button onClick={() => { const d = new Date(viewDate); d.setMonth(d.getMonth() + 1); setViewDate(d); }} className="p-1 hover:bg-slate-100 rounded-lg">
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-1">
        {dayLabels.map(l => (
          <div key={l} className="text-center text-xs font-semibold text-slate-400 py-1">{l}</div>
        ))}
      </div>

      {/* Date cells */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((day, idx) => (
          <div key={idx} className="flex items-center justify-center h-7">
            {day !== null && (
              <span
                className={[
                  "w-7 h-7 flex items-center justify-center rounded-full text-xs font-medium transition-colors",
                  isInCurrentWeek(day)
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "text-slate-600 hover:bg-slate-100",
                  isToday(day)
                    ? "ring-2 ring-blue-500 ring-offset-1"
                    : "",
                ].join(" ")}
              >
                {day}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Status Legend ─────────────────────────────────────── */
const statusLegend = [
  { color: "#22c55e", label: "Approved" },
  { color: "#f59e0b", label: "Pending" },
  { color: "#ef4444", label: "Rejected" },
  { color: "#3b82f6", label: "Saved (Draft)" },
  { color: "#94a3b8", label: "Not Submitted" },
];

/* ── Main Component ─────────────────────────────────────── */
export default function Timesheet() {
  const { data: user, isLoading } = useMe();
  const [currentWeek, setCurrentWeek] = useState(new Date(2026, 2, 16));
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState("Select client");
  const [selectedProject, setSelectedProject] = useState("Select project");
  const [projects, setProjects] = useState<Project[]>([]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return <Redirect to="/" />;

  const getWeekDates = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const startDate = new Date(d.setDate(diff));
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);
    return { startDate, endDate };
  };

  const formatDateRange = (start: Date, end: Date) => {
    const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const s = `${days[start.getDay()]}, ${start.getDate()} ${months[start.getMonth()]} ${String(start.getFullYear()).slice(-2)}`;
    const e = `${days[end.getDay()]}, ${end.getDate()} ${months[end.getMonth()]} ${String(end.getFullYear()).slice(-2)}`;
    return `${s} - ${e}`;
  };

  const formatColumnHeaderDate = (date: Date) => {
    const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
  };

  const { startDate, endDate } = getWeekDates(currentWeek);
  const dateRange = formatDateRange(startDate, endDate);

  const handlePrevWeek = () => { const d = new Date(currentWeek); d.setDate(d.getDate() - 7); setCurrentWeek(d); };
  const handleNextWeek = () => { const d = new Date(currentWeek); d.setDate(d.getDate() + 7); setCurrentWeek(d); };

  const getAvailableProjects = () => selectedClient === "Select client" ? [] : clientData[selectedClient as keyof typeof clientData] || [];

  const calculateProjectTotal = (p: Project) => Object.values(p.hours).reduce((s, h) => s + h, 0);
  const calculateDayTotal = (day: keyof Project["hours"]) => projects.reduce((s, p) => s + p.hours[day], 0);
  const calculateGrandTotal = () => projects.reduce((s, p) => s + calculateProjectTotal(p), 0);

  const handleAddProject = () => {
    if (selectedProject === "Select project" || selectedClient === "Select client") {
      alert("Please select both client and project");
      return;
    }
    setProjects([...projects, {
      id: Date.now().toString(),
      name: selectedProject,
      client: selectedClient,
      hours: { monday: 0, tuesday: 0, wednesday: 0, thursday: 0, friday: 0, saturday: 0, sunday: 0 },
    }]);
    setShowAddProjectModal(false);
    setSelectedClient("Select client");
    setSelectedProject("Select project");
  };

  const handleHourChange = (projectId: string, day: keyof Project["hours"], value: string) => {
    const numValue = parseFloat(value) || 0;
    setProjects(projects.map(p =>
      p.id === projectId ? { ...p, hours: { ...p.hours, [day]: Math.max(0, numValue) } } : p
    ));
  };

  const dayDates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    dayDates.push(d);
  }

  const handleResetModal = () => {
    setShowAddProjectModal(false);
    setSelectedClient("Select client");
    setSelectedProject("Select project");
  };

  return (
    <DashboardLayout title="Timesheet">

      {/* ── Two-Column Grid: 75% / 25% ─────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: "28px", alignItems: "start" }}>

        {/* ── LEFT COLUMN — Timesheet (75%) ─────────────────── */}
        <div className="bg-white rounded-xl shadow-sm" style={{ padding: "24px" }}>
          <div className="flex flex-col gap-6">

            {/* Top Navigation */}
            <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
              <div className="flex items-center gap-3">
                <button onClick={handlePrevWeek} className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all" data-testid="button-prev-week">
                  <ChevronLeft className="w-5 h-5 text-slate-600" />
                </button>
                <span className="text-sm font-semibold text-slate-900 min-w-max" data-testid="text-week-range">{dateRange}</span>
                <button onClick={handleNextWeek} className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all" data-testid="button-next-week">
                  <ChevronRight className="w-5 h-5 text-slate-600" />
                </button>
                <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all ml-1" data-testid="button-calendar">
                  <Calendar className="w-5 h-5 text-slate-600" />
                </button>
              </div>
              <button
                onClick={() => setShowAddProjectModal(true)}
                className="text-white px-4 py-2 rounded-lg text-sm font-semibold"
                style={{ backgroundColor: "#0F3D57" }}
                onMouseOver={e => (e.currentTarget.style.backgroundColor = "#0C3348")}
                onMouseOut={e => (e.currentTarget.style.backgroundColor = "#0F3D57")}
                data-testid="button-add-project"
              >
                + Add Project
              </button>
            </div>

            {/* Timesheet Table */}
            <div>
              {projects.length === 0 ? (
                <div className="border border-slate-200 rounded-lg p-12 flex items-center justify-center">
                  <p className="text-slate-500 text-center text-sm" data-testid="text-no-timesheet">
                    No time sheets found for this week range
                  </p>
                </div>
              ) : (
                <div className="rounded-lg overflow-x-auto border border-slate-200">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-teal-700">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white sticky left-0 z-10 bg-teal-700">Project Name</th>
                        {dayDates.map((date, idx) => (
                          <th key={idx} className="px-4 py-4 text-center text-sm font-semibold text-white whitespace-nowrap min-w-20">
                            {formatColumnHeaderDate(date)}
                          </th>
                        ))}
                        <th className="px-4 py-4 text-center text-sm font-semibold text-white min-w-20">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map((project, idx) => {
                        const projectTotal = calculateProjectTotal(project);
                        return (
                          <tr key={project.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"} data-testid={`row-project-${project.id}`}>
                            <td className="px-6 py-4 text-sm text-slate-900 font-medium sticky left-0 z-10 bg-inherit">{project.name}</td>
                            {(["monday","tuesday","wednesday","thursday","friday","saturday","sunday"] as (keyof Project["hours"])[]).map(day => (
                              <td key={day} className="px-4 py-4 text-center">
                                <input
                                  type="text"
                                  inputMode="decimal"
                                  value={project.hours[day]}
                                  onChange={e => handleHourChange(project.id, day, e.target.value)}
                                  className="w-16 px-2 py-1 border border-slate-300 rounded text-center text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                  data-testid={`input-hours-${project.id}-${day}`}
                                />
                              </td>
                            ))}
                            <td className="px-4 py-4 text-center text-sm font-semibold text-slate-900" data-testid={`text-total-${project.id}`}>
                              {projectTotal.toFixed(1)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Total Hours Bar */}
            {projects.length > 0 && (
              <div className="bg-slate-400 rounded-lg px-5 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-8 flex-1">
                    <span className="font-semibold text-white min-w-max">Total Hours</span>
                    <div className="flex gap-6">
                      {([
                        { label: "Mon", key: "monday" as const },
                        { label: "Tue", key: "tuesday" as const },
                        { label: "Wed", key: "wednesday" as const },
                        { label: "Thu", key: "thursday" as const },
                        { label: "Fri", key: "friday" as const },
                        { label: "Sat", key: "saturday" as const },
                        { label: "Sun", key: "sunday" as const },
                      ]).map(day => (
                        <div key={day.label} className="text-center min-w-16">
                          <p className="text-sm font-semibold text-white" data-testid={`text-total-${day.label}`}>
                            {calculateDayTotal(day.key).toFixed(1)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-8">
                    <span className="text-sm font-semibold text-white mr-2" data-testid="text-grand-total">
                      Total: {calculateGrandTotal().toFixed(1)}h
                    </span>
                    <Button className="bg-slate-500 text-white hover:bg-slate-600" data-testid="button-save">Save</Button>
                    <Button className="bg-teal-700 text-white hover:bg-teal-800" data-testid="button-submit">Submit Timesheet</Button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* ── RIGHT COLUMN — Calendar + Legend (25%) ─────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Calendar Card */}
          <div className="bg-white rounded-xl shadow-sm" style={{ padding: "20px" }}>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-800">Calendar</h3>
            </div>
            <MiniCalendar referenceDate={currentWeek} />
          </div>

          {/* Status Legend Card */}
          <div className="bg-white rounded-xl shadow-sm" style={{ padding: "16px" }}>
            <h3 className="text-sm font-bold text-slate-800 mb-3">Status Legend</h3>
            <div className="space-y-2.5">
              {statusLegend.map(({ color, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                  <span className="text-xs text-slate-600">{label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* ── Add Project Modal ───────────────────────────────── */}
      {showAddProjectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" data-testid="modal-add-project">
          <div className="bg-white rounded-lg p-8 shadow-lg max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">Add new project</h2>
              <button onClick={handleResetModal} className="p-1 hover:bg-slate-100 rounded" data-testid="button-close-modal">
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs uppercase font-semibold text-slate-600 block mb-2">Client</label>
                <select
                  value={selectedClient}
                  onChange={e => { setSelectedClient(e.target.value); setSelectedProject("Select project"); }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  data-testid="select-client"
                >
                  <option value="Select client">Select client</option>
                  {Object.keys(clientData).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs uppercase font-semibold text-slate-600 block mb-2">Project Name</label>
                <select
                  value={selectedProject}
                  onChange={e => setSelectedProject(e.target.value)}
                  disabled={selectedClient === "Select client"}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-slate-100 disabled:cursor-not-allowed"
                  data-testid="select-project"
                >
                  <option value="Select project">Select project</option>
                  {getAvailableProjects().map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={handleResetModal} className="flex-1 border-slate-300 text-slate-700" data-testid="button-cancel">Cancel</Button>
                <Button onClick={handleAddProject} className="flex-1 bg-primary text-white hover:bg-primary/90" data-testid="button-add-confirm">Add</Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}
