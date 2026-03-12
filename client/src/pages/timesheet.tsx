import { useState, useRef, useEffect } from "react";
import { useMe } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { ChevronLeft, ChevronRight, Calendar, X, CheckCircle, Lock, ThumbsUp, ThumbsDown } from "lucide-react";
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

type TimesheetStatus = "draft" | "saved" | "submitted" | "approved" | "rejected";

const clientData = {
  "NovintiX": ["AI - Internal", "Internal"],
};

const HEADER_COLOR = "#0F3D57";

const STATUS_COLORS: Record<string, string> = {
  saved: "#3b82f6",
  submitted: "#f59e0b",
  approved: "#22c55e",
  rejected: "#ef4444",
};

function getWeekMonday(d: Date): Date {
  const copy = new Date(d);
  const day = copy.getDay();
  const diff = copy.getDate() - day + (day === 0 ? -6 : 1);
  copy.setDate(diff);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function weekKey(d: Date): string {
  const mon = getWeekMonday(d);
  return `${mon.getFullYear()}-${String(mon.getMonth() + 1).padStart(2, "0")}-${String(mon.getDate()).padStart(2, "0")}`;
}

/* ── Mini Calendar ─────────────────────────────────────── */
function MiniCalendar({
  referenceDate,
  onSelectDate,
  weekStatuses = {},
}: {
  referenceDate: Date;
  onSelectDate?: (d: Date) => void;
  weekStatuses?: Record<string, TimesheetStatus>;
}) {
  const [viewDate, setViewDate] = useState(new Date(referenceDate));
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const dayLabels = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const rawFirstDay = new Date(year, month, 1).getDay();
  const firstDayOfMonth = rawFirstDay === 0 ? 6 : rawFirstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const currentWeekKey = weekKey(referenceDate);

  const isToday = (day: number) =>
    today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;

  const getDayWeekKey = (day: number) => weekKey(new Date(year, month, day));

  const getDayColor = (day: number): string | null => {
    const key = getDayWeekKey(day);
    const status = weekStatuses[key];
    if (status && STATUS_COLORS[status]) return STATUS_COLORS[status];
    if (key === currentWeekKey) return HEADER_COLOR;
    return null;
  };

  const cells: (number | null)[] = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => { const d = new Date(viewDate); d.setMonth(d.getMonth() - 1); setViewDate(d); }}
          className="p-1 hover:bg-slate-100 rounded-lg"
        >
          <ChevronLeft className="w-4 h-4 text-slate-500" />
        </button>
        <span className="text-xs font-bold text-slate-700">{monthNames[month]} {year}</span>
        <button
          onClick={() => { const d = new Date(viewDate); d.setMonth(d.getMonth() + 1); setViewDate(d); }}
          className="p-1 hover:bg-slate-100 rounded-lg"
        >
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>
      </div>
      <div className="grid grid-cols-7 mb-1">
        {dayLabels.map(l => (
          <div key={l} className="text-center text-xs font-semibold text-slate-400 py-1">{l}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((day, idx) => {
          const bgColor = day !== null ? getDayColor(day) : null;
          const colored = bgColor !== null;
          return (
            <div key={idx} className="flex items-center justify-center h-7">
              {day !== null && (
                <span
                  onClick={() => onSelectDate && onSelectDate(new Date(year, month, day))}
                  className={[
                    "w-7 h-7 flex items-center justify-center rounded-full text-xs font-medium transition-colors",
                    onSelectDate ? "cursor-pointer" : "",
                    colored ? "text-white font-semibold" : "text-slate-600 hover:bg-slate-100",
                    isToday(day) && !colored ? "ring-2 ring-blue-400 ring-offset-1" : "",
                  ].join(" ")}
                  style={colored ? { backgroundColor: bgColor! } : {}}
                >
                  {day}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Status Legend ─────────────────────────────────────── */
const statusLegend = [
  { color: "#22c55e", label: "Approved" },
  { color: "#f59e0b", label: "Submitted (Pending)" },
  { color: "#ef4444", label: "Rejected" },
  { color: "#3b82f6", label: "Draft" },
];

/* ── Main Component ─────────────────────────────────────── */
export default function Timesheet() {
  const { data: user, isLoading } = useMe();
  const [currentWeek, setCurrentWeek] = useState(new Date(2026, 2, 16));
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showCalendarPopup, setShowCalendarPopup] = useState(false);
  const [selectedClient, setSelectedClient] = useState("Select client");
  const [selectedProject, setSelectedProject] = useState("Select project");
  const [projects, setProjects] = useState<Project[]>([]);
  const [timesheetStatus, setTimesheetStatus] = useState<TimesheetStatus>("draft");
  const [weekStatuses, setWeekStatuses] = useState<Record<string, TimesheetStatus>>({});
  const [hourLimitHit, setHourLimitHit] = useState(false);
  const calendarBtnRef = useRef<HTMLButtonElement>(null);
  const calendarPopupRef = useRef<HTMLDivElement>(null);

  /* Close calendar popup on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        calendarPopupRef.current &&
        !calendarPopupRef.current.contains(e.target as Node) &&
        calendarBtnRef.current &&
        !calendarBtnRef.current.contains(e.target as Node)
      ) {
        setShowCalendarPopup(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
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

  const switchToWeek = (d: Date) => {
    setCurrentWeek(d);
    const key = weekKey(d);
    setTimesheetStatus(weekStatuses[key] || "draft");
    setProjects([]);
    setHourLimitHit(false);
  };

  const navigateWeek = (dir: "prev" | "next") => {
    const d = new Date(currentWeek);
    d.setDate(d.getDate() + (dir === "prev" ? -7 : 7));
    switchToWeek(d);
  };

  const getAvailableProjects = () =>
    selectedClient === "Select client" ? [] : clientData[selectedClient as keyof typeof clientData] || [];

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
    setTimesheetStatus("draft");
    setShowAddProjectModal(false);
    setSelectedClient("Select client");
    setSelectedProject("Select project");
  };

  const handleHourChange = (projectId: string, day: keyof Project["hours"], value: string) => {
    if (isLocked) return;
    const numValue = parseInt(value, 10) || 0;
    const clamped = Math.min(12, Math.max(0, numValue));
    if (numValue > 12) setHourLimitHit(true);
    setProjects(projects.map(p =>
      p.id === projectId ? { ...p, hours: { ...p.hours, [day]: clamped } } : p
    ));
    if (timesheetStatus === "saved") setTimesheetStatus("draft");
  };

  const setStatusForWeek = (status: TimesheetStatus) => {
    const key = weekKey(currentWeek);
    setTimesheetStatus(status);
    setWeekStatuses(prev => ({ ...prev, [key]: status }));
  };

  const handleSave = () => setStatusForWeek("saved");

  const handleSubmit = () => {
    if (isLocked) return;
    setStatusForWeek("submitted");
  };

  const handleApprove = () => setStatusForWeek("approved");
  const handleReject = () => setStatusForWeek("rejected");

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

  const isSubmitted = timesheetStatus === "submitted";
  const isSaved = timesheetStatus === "saved";
  const isApproved = timesheetStatus === "approved";
  const isRejected = timesheetStatus === "rejected";
  const isLocked = isSubmitted || isApproved || isRejected;

  const statusBadge = () => {
    if (isApproved) return <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200"><CheckCircle className="w-3 h-3" /> Approved</span>;
    if (isRejected) return <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-200"><X className="w-3 h-3" /> Rejected</span>;
    if (isSubmitted) return <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200"><Lock className="w-3 h-3" /> Submitted</span>;
    return null;
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
                <button
                  onClick={() => navigateWeek("prev")}
                  className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all"
                  data-testid="button-prev-week"
                >
                  <ChevronLeft className="w-5 h-5 text-slate-600" />
                </button>
                <span className="text-sm font-semibold text-slate-900 min-w-max" data-testid="text-week-range">
                  {dateRange}
                </span>
                <button
                  onClick={() => navigateWeek("next")}
                  className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all"
                  data-testid="button-next-week"
                >
                  <ChevronRight className="w-5 h-5 text-slate-600" />
                </button>

                {/* Calendar icon — popup toggle */}
                <div className="relative ml-1">
                  <button
                    ref={calendarBtnRef}
                    onClick={() => setShowCalendarPopup(v => !v)}
                    className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all"
                    data-testid="button-calendar"
                  >
                    <Calendar className="w-5 h-5 text-slate-600" />
                  </button>
                  {showCalendarPopup && (
                    <div
                      ref={calendarPopupRef}
                      className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 z-50"
                      style={{ padding: "16px", width: "260px" }}
                    >
                      <MiniCalendar
                        referenceDate={currentWeek}
                        weekStatuses={weekStatuses}
                        onSelectDate={(d) => {
                          switchToWeek(d);
                          setShowCalendarPopup(false);
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Status badge */}
                {statusBadge()}
              </div>

              <button
                onClick={() => !isLocked && setShowAddProjectModal(true)}
                className="text-white px-4 py-2 rounded-lg text-sm font-semibold transition-opacity"
                style={{ backgroundColor: HEADER_COLOR, opacity: isLocked ? 0.5 : 1, cursor: isLocked ? "not-allowed" : "pointer" }}
                onMouseOver={e => { if (!isLocked) e.currentTarget.style.backgroundColor = "#0C3348"; }}
                onMouseOut={e => { e.currentTarget.style.backgroundColor = HEADER_COLOR; }}
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
                  <table className="w-full table-fixed">
                    <colgroup>
                      <col style={{ width: "180px" }} />
                      {dayDates.map((_, i) => <col key={i} style={{ width: "88px" }} />)}
                      <col style={{ width: "72px" }} />
                    </colgroup>
                    <thead>
                      <tr style={{ backgroundColor: HEADER_COLOR }}>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white sticky left-0 z-10" style={{ backgroundColor: HEADER_COLOR }}>
                          Project Name
                        </th>
                        {dayDates.map((date, idx) => (
                          <th key={idx} className="px-4 py-4 text-center text-sm font-semibold text-white whitespace-nowrap">
                            {formatColumnHeaderDate(date)}
                          </th>
                        ))}
                        <th className="px-4 py-4 text-center text-sm font-semibold text-white">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map((project, idx) => {
                        const projectTotal = calculateProjectTotal(project);
                        return (
                          <tr key={project.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"} data-testid={`row-project-${project.id}`}>
                            <td className="px-6 py-4 text-sm text-slate-900 font-medium sticky left-0 z-10 bg-inherit truncate">
                              {project.name}
                            </td>
                            {(["monday","tuesday","wednesday","thursday","friday","saturday","sunday"] as (keyof Project["hours"])[]).map(day => (
                              <td key={day} className="px-4 py-3 text-center">
                                {isLocked ? (
                                  <span className="inline-block w-14 px-2 py-1 bg-slate-100 rounded text-center text-sm text-slate-600 font-medium">
                                    {project.hours[day]}
                                  </span>
                                ) : (
                                  <input
                                    type="number"
                                    inputMode="numeric"
                                    min={0}
                                    max={12}
                                    step={1}
                                    value={project.hours[day] === 0 ? "" : project.hours[day]}
                                    placeholder="0"
                                    onChange={e => handleHourChange(project.id, day, e.target.value)}
                                    onBlur={e => handleHourChange(project.id, day, e.target.value)}
                                    className="w-14 px-2 py-1 border border-slate-300 rounded text-center text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    data-testid={`input-hours-${project.id}-${day}`}
                                  />
                                )}
                              </td>
                            ))}
                            <td className="px-4 py-3 text-center text-sm font-semibold text-slate-900" data-testid={`text-total-${project.id}`}>
                              {projectTotal}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr style={{ backgroundColor: "#475569" }}>
                        <td className="px-6 py-3 text-sm font-bold text-white sticky left-0 z-10" style={{ backgroundColor: "#475569" }}>
                          Total Hours
                        </td>
                        {(["monday","tuesday","wednesday","thursday","friday","saturday","sunday"] as (keyof Project["hours"])[]).map(day => (
                          <td key={day} className="px-4 py-3 text-center text-sm font-bold text-white" data-testid={`text-total-${day}`}>
                            {calculateDayTotal(day)}
                          </td>
                        ))}
                        <td className="px-4 py-3 text-center text-sm font-bold text-white" data-testid="text-grand-total">
                          {calculateGrandTotal()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>

            {/* Validation Warning */}
            {hourLimitHit && projects.length > 0 && !isLocked && (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm" data-testid="text-hour-limit-warning">
                <svg className="w-4 h-4 flex-shrink-0 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                Maximum 12 hours allowed per day.
              </div>
            )}

            {/* Save / Submit Bar */}
            {projects.length > 0 && (
              <div className="flex items-center justify-end gap-3">
                <Button
                  onClick={handleSave}
                  disabled={isLocked}
                  className="text-white disabled:opacity-50"
                  style={{ backgroundColor: isSaved ? "#3b82f6" : "#475569" }}
                  data-testid="button-save"
                >
                  {isSaved ? <><CheckCircle className="w-4 h-4 mr-1" /> Draft</> : "Draft"}
                </Button>

                <Button
                  onClick={handleSubmit}
                  disabled={isLocked}
                  className="text-white disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ backgroundColor: isLocked ? "#64748b" : HEADER_COLOR }}
                  data-testid="button-submit"
                >
                  {isSubmitted || isApproved || isRejected ? <><Lock className="w-4 h-4 mr-1" /> Submitted</> : "Submit Timesheet"}
                </Button>
              </div>
            )}

            {/* Manager Actions (simulate approve / reject after submission) */}
            {isSubmitted && (
              <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
                <span className="text-xs text-slate-500 font-medium mr-1">Simulate manager action:</span>
                <Button
                  onClick={handleApprove}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  data-testid="button-approve"
                >
                  <ThumbsUp className="w-3.5 h-3.5 mr-1" /> Approve
                </Button>
                <Button
                  onClick={handleReject}
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white"
                  data-testid="button-reject"
                >
                  <ThumbsDown className="w-3.5 h-3.5 mr-1" /> Reject
                </Button>
              </div>
            )}

          </div>
        </div>

        {/* ── RIGHT COLUMN — Calendar + Legend (25%) ─────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Calendar Card */}
          <div className="bg-white rounded-xl shadow-sm" style={{ padding: "20px" }}>
            <MiniCalendar
              referenceDate={currentWeek}
              weekStatuses={weekStatuses}
              onSelectDate={(d) => switchToWeek(d)}
            />
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
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  data-testid="select-project"
                  disabled={selectedClient === "Select client"}
                >
                  <option value="Select project">Select project</option>
                  {getAvailableProjects().map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <Button variant="outline" className="flex-1" onClick={handleResetModal} data-testid="button-cancel-modal">
                Cancel
              </Button>
              <Button
                className="flex-1 text-white"
                style={{ backgroundColor: HEADER_COLOR }}
                onClick={handleAddProject}
                data-testid="button-confirm-add-project"
              >
                Add Project
              </Button>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}
