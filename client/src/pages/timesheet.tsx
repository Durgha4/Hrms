import { useState } from "react";
import { useMe } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { ChevronLeft, ChevronRight, Calendar, X, Trash2 } from "lucide-react";
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

export default function Timesheet() {
  const { data: user, isLoading } = useMe();
  const [currentWeek, setCurrentWeek] = useState(new Date(2026, 2, 16)); // Mar 16, 2026
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState("Select client");
  const [selectedProject, setSelectedProject] = useState("Select project");
  const [calendarMonth, setCalendarMonth] = useState(new Date(2026, 2)); // March 2026
  const [projects, setProjects] = useState<Project[]>([]);
  const [formHours, setFormHours] = useState({
    monday: 0,
    tuesday: 0,
    wednesday: 0,
    thursday: 0,
    friday: 0,
    saturday: 0,
    sunday: 0,
  });

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
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const startStr = `${days[start.getDay()]}, ${start.getDate()} ${months[start.getMonth()]} ${String(start.getFullYear()).slice(-2)}`;
    const endStr = `${days[end.getDay()]}, ${end.getDate()} ${months[end.getMonth()]} ${String(end.getFullYear()).slice(-2)}`;
    return `${startStr} - ${endStr}`;
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatMonthYear = (date: Date) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const { startDate, endDate } = getWeekDates(currentWeek);
  const dateRange = formatDateRange(startDate, endDate);

  const handlePrevWeek = () => {
    const prevDate = new Date(currentWeek);
    prevDate.setDate(prevDate.getDate() - 7);
    setCurrentWeek(prevDate);
  };

  const handleNextWeek = () => {
    const nextDate = new Date(currentWeek);
    nextDate.setDate(nextDate.getDate() + 7);
    setCurrentWeek(nextDate);
  };

  const handlePrevMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1));
  };

  const getCalendarDays = () => {
    const days = [];
    const daysInMonth = getDaysInMonth(calendarMonth);
    const firstDay = getFirstDayOfMonth(calendarMonth);

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const getDateStatus = (date: number) => {
    const approvedDates = [4, 5, 6, 7, 8];
    const submittedDates = [11, 12, 13];
    const rejectedDates = [18, 19, 20];
    const draftDates = [25, 26, 27, 28];

    if (approvedDates.includes(date)) return "approved";
    if (submittedDates.includes(date)) return "submitted";
    if (rejectedDates.includes(date)) return "rejected";
    if (draftDates.includes(date)) return "draft";
    return "none";
  };

  const calendarDays = getCalendarDays();

  const calculateTotalHours = () => {
    let total = 0;
    projects.forEach(project => {
      total += project.hours.monday + project.hours.tuesday + project.hours.wednesday + 
               project.hours.thursday + project.hours.friday + project.hours.saturday + project.hours.sunday;
    });
    return total;
  };

  const calculateDayTotal = (day: keyof typeof formHours) => {
    let total = 0;
    projects.forEach(project => {
      total += project.hours[day];
    });
    return total;
  };

  const handleAddProject = () => {
    if (selectedProject === "Select project" || selectedClient === "Select client") {
      alert("Please select both client and project");
      return;
    }

    const newProject: Project = {
      id: Date.now().toString(),
      name: selectedProject,
      client: selectedClient,
      hours: { ...formHours },
    };

    setProjects([...projects, newProject]);
    setShowAddProjectModal(false);
    setSelectedClient("Select client");
    setSelectedProject("Select project");
    setFormHours({
      monday: 0,
      tuesday: 0,
      wednesday: 0,
      thursday: 0,
      friday: 0,
      saturday: 0,
      sunday: 0,
    });
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  const handleHourChange = (day: keyof typeof formHours, value: string) => {
    setFormHours({
      ...formHours,
      [day]: parseFloat(value) || 0,
    });
  };

  const handleResetModal = () => {
    setShowAddProjectModal(false);
    setSelectedClient("Select client");
    setSelectedProject("Select project");
    setFormHours({
      monday: 0,
      tuesday: 0,
      wednesday: 0,
      thursday: 0,
      friday: 0,
      saturday: 0,
      sunday: 0,
    });
  };

  return (
    <DashboardLayout title="Timesheet">
      <div className="h-full flex flex-col">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-6 bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrevWeek}
              className="p-2 hover:bg-slate-100 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>

            <span className="text-sm font-semibold text-slate-900 min-w-max">
              {dateRange}
            </span>

            <button
              onClick={handleNextWeek}
              className="p-2 hover:bg-slate-100 rounded-lg"
            >
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>

            <button 
              onClick={() => setShowCalendarModal(!showCalendarModal)}
              className="p-2 hover:bg-slate-100 rounded-lg ml-2"
            >
              <Calendar className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          <button 
            onClick={() => setShowAddProjectModal(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90"
          >
            + Add Project
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="flex gap-6 flex-1">
          {/* Center Panel - Timesheet Table */}
          <div className="flex-1">
            {projects.length === 0 ? (
              <div className="bg-white rounded-lg p-12 shadow-sm flex items-center justify-center min-h-96">
                <p className="text-slate-500 text-center text-lg">
                  No time sheets found for this week range
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Project</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-slate-900">Mon</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-slate-900">Tue</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-slate-900">Wed</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-slate-900">Thu</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-slate-900">Fri</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-slate-900">Sat</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-slate-900">Sun</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-slate-900">Total</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-slate-900">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project) => {
                      const projectTotal = project.hours.monday + project.hours.tuesday + project.hours.wednesday + 
                                          project.hours.thursday + project.hours.friday + project.hours.saturday + project.hours.sunday;
                      return (
                        <tr key={project.id} className="border-b border-slate-200 hover:bg-slate-50">
                          <td className="px-6 py-4 text-sm text-slate-900">
                            <div>
                              <p className="font-semibold">{project.name}</p>
                              <p className="text-xs text-slate-500">{project.client}</p>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center text-sm text-slate-900">{project.hours.monday}</td>
                          <td className="px-4 py-4 text-center text-sm text-slate-900">{project.hours.tuesday}</td>
                          <td className="px-4 py-4 text-center text-sm text-slate-900">{project.hours.wednesday}</td>
                          <td className="px-4 py-4 text-center text-sm text-slate-900">{project.hours.thursday}</td>
                          <td className="px-4 py-4 text-center text-sm text-slate-900">{project.hours.friday}</td>
                          <td className="px-4 py-4 text-center text-sm text-slate-900">{project.hours.saturday}</td>
                          <td className="px-4 py-4 text-center text-sm text-slate-900">{project.hours.sunday}</td>
                          <td className="px-4 py-4 text-center text-sm font-semibold text-slate-900">{projectTotal}</td>
                          <td className="px-4 py-4 text-center">
                            <button
                              onClick={() => handleDeleteProject(project.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Right Panel - Calendar */}
          <div className="w-80">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4">March 2026</h3>

              {/* Calendar Grid */}
              <div className="mb-6">
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                    <div key={day} className="text-center text-xs font-semibold text-slate-600">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar dates */}
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 31 }).map((_, i) => {
                    const date = i + 1;
                    let bgColor = "bg-white hover:bg-slate-50";

                    if ([4, 5, 6, 7, 8].includes(date)) bgColor = "bg-green-100";
                    if ([11, 12, 13].includes(date)) bgColor = "bg-yellow-100";
                    if ([18, 19, 20].includes(date)) bgColor = "bg-red-100";
                    if ([25, 26, 27, 28].includes(date)) bgColor = "bg-blue-100";

                    return (
                      <div
                        key={date}
                        className={`h-8 flex items-center justify-center text-xs font-medium rounded ${bgColor} text-slate-900 cursor-pointer`}
                      >
                        {date}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status Legend */}
              <div className="border-t pt-4 space-y-2">
                <h4 className="text-xs font-semibold text-slate-600 uppercase">Status</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded"></div>
                    <span className="text-slate-600">Approved</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-400 rounded"></div>
                    <span className="text-slate-600">Submitted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded"></div>
                    <span className="text-slate-600">Rejected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-400 rounded"></div>
                    <span className="text-slate-600">Draft</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Total Hours */}
        <div className="mt-6 bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <span className="font-semibold text-slate-900">Total Hours</span>
              <div className="flex gap-6">
                {[
                  { label: "Mon", key: "monday" as const },
                  { label: "Tue", key: "tuesday" as const },
                  { label: "Wed", key: "wednesday" as const },
                  { label: "Thu", key: "thursday" as const },
                  { label: "Fri", key: "friday" as const },
                  { label: "Sat", key: "saturday" as const },
                  { label: "Sun", key: "sunday" as const },
                ].map(day => (
                  <div key={day.label} className="text-center">
                    <p className="text-xs text-slate-600 font-medium">{day.label}</p>
                    <p className="text-sm font-semibold text-slate-900">{calculateDayTotal(day.key)}h</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="border-slate-300 text-slate-700 hover:bg-white hover:border-slate-400"
              >
                Save
              </Button>
              <Button className="bg-primary text-white hover:bg-primary/90">
                Submit Timesheet
              </Button>
            </div>
          </div>
        </div>

        {/* Calendar Modal */}
        {showCalendarModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-lg max-w-2xl w-full">
              {/* Modal Header with Navigation */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <ChevronLeft className="w-5 h-5 text-slate-600" />
                </button>
                <h2 className="text-lg font-bold text-slate-900">
                  {formatMonthYear(calendarMonth)}
                </h2>
                <button
                  onClick={handleNextMonth}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <ChevronRight className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="mb-6">
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-3 mb-3">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
                    <div key={day} className="text-center text-xs font-bold text-slate-700">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar dates */}
                <div className="grid grid-cols-7 gap-3">
                  {calendarDays.map((date, idx) => {
                    if (!date) {
                      return <div key={`empty-${idx}`} className="h-10"></div>;
                    }

                    const status = getDateStatus(date);
                    let bgColor = "bg-white hover:bg-slate-50 border border-slate-200";
                    let textColor = "text-slate-900 font-semibold";

                    if (status === "approved") {
                      bgColor = "bg-green-100 border border-green-300";
                    } else if (status === "submitted") {
                      bgColor = "bg-yellow-100 border border-yellow-300";
                    } else if (status === "rejected") {
                      bgColor = "bg-red-100 border border-red-300";
                    } else if (status === "draft") {
                      bgColor = "bg-blue-100 border border-blue-300";
                    }

                    return (
                      <div
                        key={date}
                        className={`h-10 flex items-center justify-center text-sm rounded cursor-pointer ${bgColor} ${textColor}`}
                      >
                        {date}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status Legend */}
              <div className="border-t pt-4 grid grid-cols-4 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-400 rounded"></div>
                  <span className="text-sm text-slate-600">Approved (7)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                  <span className="text-sm text-slate-600">Submitted (14)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-400 rounded"></div>
                  <span className="text-sm text-slate-600">Rejected (0)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-400 rounded"></div>
                  <span className="text-sm text-slate-600">Draft (0)</span>
                </div>
              </div>

              <Button
                onClick={() => setShowCalendarModal(false)}
                className="w-full bg-primary text-white hover:bg-primary/90"
              >
                Close
              </Button>
            </div>
          </div>
        )}

        {/* Add Project Modal */}
        {showAddProjectModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900">Add new project</h2>
                <button
                  onClick={handleResetModal}
                  className="p-1 hover:bg-slate-100 rounded"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Client and Project Dropdowns */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase font-semibold text-slate-600 block mb-2">
                      Client
                    </label>
                    <select
                      value={selectedClient}
                      onChange={(e) => setSelectedClient(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="Select client">Select client</option>
                      <option value="NovintiX">NovintiX</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs uppercase font-semibold text-slate-600 block mb-2">
                      Project Name
                    </label>
                    <select
                      value={selectedProject}
                      onChange={(e) => setSelectedProject(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="Select project">Select project</option>
                      <option value="AI - Internal">AI - Internal</option>
                      <option value="Internal">Internal</option>
                    </select>
                  </div>
                </div>

                {/* Hours Input Fields */}
                <div className="border-t pt-4">
                  <label className="text-xs uppercase font-semibold text-slate-600 block mb-3">
                    Hours per Day
                  </label>
                  <div className="grid grid-cols-7 gap-2">
                    {[
                      { label: "Mon", key: "monday" as const },
                      { label: "Tue", key: "tuesday" as const },
                      { label: "Wed", key: "wednesday" as const },
                      { label: "Thu", key: "thursday" as const },
                      { label: "Fri", key: "friday" as const },
                      { label: "Sat", key: "saturday" as const },
                      { label: "Sun", key: "sunday" as const },
                    ].map(day => (
                      <div key={day.label}>
                        <label className="text-xs text-slate-600 block mb-1">{day.label}</label>
                        <input
                          type="number"
                          min="0"
                          max="24"
                          step="0.5"
                          value={formHours[day.key]}
                          onChange={(e) => handleHourChange(day.key, e.target.value)}
                          className="w-full px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={handleResetModal}
                    className="flex-1 border-slate-300 text-slate-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddProject}
                    className="flex-1 bg-primary text-white hover:bg-primary/90"
                  >
                    Add Project
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
