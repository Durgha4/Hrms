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

// Mock data for clients and projects
const clientData = {
  "NovintiX": ["AI - Internal", "Internal"],
};

export default function Timesheet() {
  const { data: user, isLoading } = useMe();
  const [currentWeek, setCurrentWeek] = useState(new Date(2026, 2, 16)); // Mar 16, 2026
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
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const startStr = `${days[start.getDay()]}, ${start.getDate()} ${months[start.getMonth()]} ${String(start.getFullYear()).slice(-2)}`;
    const endStr = `${days[end.getDay()]}, ${end.getDate()} ${months[end.getMonth()]} ${String(end.getFullYear()).slice(-2)}`;
    return `${startStr} - ${endStr}`;
  };

  const formatColumnHeaderDate = (date: Date) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
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

  const getAvailableProjects = () => {
    if (selectedClient === "Select client") {
      return [];
    }
    return clientData[selectedClient as keyof typeof clientData] || [];
  };

  const calculateProjectTotal = (project: Project) => {
    return Object.values(project.hours).reduce((sum, hours) => sum + hours, 0);
  };

  const calculateDayTotal = (day: keyof Project['hours']) => {
    return projects.reduce((sum, project) => sum + project.hours[day], 0);
  };

  const calculateGrandTotal = () => {
    return projects.reduce((sum, project) => sum + calculateProjectTotal(project), 0);
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
      hours: {
        monday: 0,
        tuesday: 0,
        wednesday: 0,
        thursday: 0,
        friday: 0,
        saturday: 0,
        sunday: 0,
      },
    };

    setProjects([...projects, newProject]);
    setShowAddProjectModal(false);
    setSelectedClient("Select client");
    setSelectedProject("Select project");
  };

  const handleHourChange = (projectId: string, day: keyof Project['hours'], value: string) => {
    const numValue = parseFloat(value) || 0;
    setProjects(projects.map(p => 
      p.id === projectId 
        ? { ...p, hours: { ...p.hours, [day]: Math.max(0, numValue) } }
        : p
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
      <div className="h-full flex flex-col">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-6 bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrevWeek}
              className="p-2 hover:bg-slate-100 rounded-lg"
              data-testid="button-prev-week"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>

            <span className="text-sm font-semibold text-slate-900 min-w-max" data-testid="text-week-range">
              {dateRange}
            </span>

            <button
              onClick={handleNextWeek}
              className="p-2 hover:bg-slate-100 rounded-lg"
              data-testid="button-next-week"
            >
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>

            <button 
              className="p-2 hover:bg-slate-100 rounded-lg ml-2"
              data-testid="button-calendar"
            >
              <Calendar className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          <button 
            onClick={() => setShowAddProjectModal(true)}
            className="text-white px-4 py-2 rounded-lg text-sm font-semibold"
            style={{ backgroundColor: "#0F766E" }}
            onMouseOver={e => (e.currentTarget.style.backgroundColor = "#0D6B63")}
            onMouseOut={e => (e.currentTarget.style.backgroundColor = "#0F766E")}
            data-testid="button-add-project"
          >
            + Add Project
          </button>
        </div>

        {/* Main Content - Timesheet Table */}
        <div className="flex-1 flex flex-col">
          {projects.length === 0 ? (
            <div className="bg-white rounded-lg p-12 shadow-sm flex items-center justify-center flex-1">
              <p className="text-slate-500 text-center text-lg" data-testid="text-no-timesheet">
                No time sheets found for this week range
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-x-auto flex-1 flex flex-col">
              <table className="w-full h-full">
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
                        <td className="px-4 py-4 text-center">
                          <input
                            type="text"
                            inputMode="decimal"
                            value={project.hours.monday}
                            onChange={(e) => handleHourChange(project.id, 'monday', e.target.value)}
                            className="w-16 px-2 py-1 border border-slate-300 rounded text-center text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            data-testid={`input-hours-${project.id}-monday`}
                          />
                        </td>
                        <td className="px-4 py-4 text-center">
                          <input
                            type="text"
                            inputMode="decimal"
                            value={project.hours.tuesday}
                            onChange={(e) => handleHourChange(project.id, 'tuesday', e.target.value)}
                            className="w-16 px-2 py-1 border border-slate-300 rounded text-center text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            data-testid={`input-hours-${project.id}-tuesday`}
                          />
                        </td>
                        <td className="px-4 py-4 text-center">
                          <input
                            type="text"
                            inputMode="decimal"
                            value={project.hours.wednesday}
                            onChange={(e) => handleHourChange(project.id, 'wednesday', e.target.value)}
                            className="w-16 px-2 py-1 border border-slate-300 rounded text-center text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            data-testid={`input-hours-${project.id}-wednesday`}
                          />
                        </td>
                        <td className="px-4 py-4 text-center">
                          <input
                            type="text"
                            inputMode="decimal"
                            value={project.hours.thursday}
                            onChange={(e) => handleHourChange(project.id, 'thursday', e.target.value)}
                            className="w-16 px-2 py-1 border border-slate-300 rounded text-center text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            data-testid={`input-hours-${project.id}-thursday`}
                          />
                        </td>
                        <td className="px-4 py-4 text-center">
                          <input
                            type="text"
                            inputMode="decimal"
                            value={project.hours.friday}
                            onChange={(e) => handleHourChange(project.id, 'friday', e.target.value)}
                            className="w-16 px-2 py-1 border border-slate-300 rounded text-center text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            data-testid={`input-hours-${project.id}-friday`}
                          />
                        </td>
                        <td className="px-4 py-4 text-center">
                          <input
                            type="text"
                            inputMode="decimal"
                            value={project.hours.saturday}
                            onChange={(e) => handleHourChange(project.id, 'saturday', e.target.value)}
                            className="w-16 px-2 py-1 border border-slate-300 rounded text-center text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            data-testid={`input-hours-${project.id}-saturday`}
                          />
                        </td>
                        <td className="px-4 py-4 text-center">
                          <input
                            type="text"
                            inputMode="decimal"
                            value={project.hours.sunday}
                            onChange={(e) => handleHourChange(project.id, 'sunday', e.target.value)}
                            className="w-16 px-2 py-1 border border-slate-300 rounded text-center text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            data-testid={`input-hours-${project.id}-sunday`}
                          />
                        </td>
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

        {/* Bottom Section - Total Hours */}
        {projects.length > 0 && (
          <div className="mt-6 bg-slate-400 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8 flex-1">
                <span className="font-semibold text-white min-w-max">Total Hours</span>
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
                    <div key={day.label} className="text-center min-w-16">
                      <p className="text-sm font-semibold text-white" data-testid={`text-total-${day.label}`}>
                        {calculateDayTotal(day.key).toFixed(1)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 ml-8">
                <div className="text-center">
                  <span className="text-sm font-semibold text-white mr-4" data-testid="text-grand-total">
                    Total: {calculateGrandTotal().toFixed(1)}h
                  </span>
                </div>
                <Button
                  className="bg-slate-500 text-white hover:bg-slate-600"
                  data-testid="button-save"
                >
                  Save
                </Button>
                <Button 
                  className="bg-teal-700 text-white hover:bg-teal-800"
                  data-testid="button-submit"
                >
                  Submit Timesheet
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Add Project Modal */}
        {showAddProjectModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" data-testid="modal-add-project">
            <div className="bg-white rounded-lg p-8 shadow-lg max-w-md w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900">Add new project</h2>
                <button
                  onClick={handleResetModal}
                  className="p-1 hover:bg-slate-100 rounded"
                  data-testid="button-close-modal"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Client Dropdown */}
                <div>
                  <label className="text-xs uppercase font-semibold text-slate-600 block mb-2">
                    Client
                  </label>
                  <select
                    value={selectedClient}
                    onChange={(e) => {
                      setSelectedClient(e.target.value);
                      setSelectedProject("Select project");
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    data-testid="select-client"
                  >
                    <option value="Select client">Select client</option>
                    {Object.keys(clientData).map(client => (
                      <option key={client} value={client}>{client}</option>
                    ))}
                  </select>
                </div>

                {/* Project Dropdown */}
                <div>
                  <label className="text-xs uppercase font-semibold text-slate-600 block mb-2">
                    Project Name
                  </label>
                  <select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    disabled={selectedClient === "Select client"}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-slate-100 disabled:cursor-not-allowed"
                    data-testid="select-project"
                  >
                    <option value="Select project">Select project</option>
                    {getAvailableProjects().map(project => (
                      <option key={project} value={project}>{project}</option>
                    ))}
                  </select>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={handleResetModal}
                    className="flex-1 border-slate-300 text-slate-700"
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddProject}
                    className="flex-1 bg-primary text-white hover:bg-primary/90"
                    data-testid="button-add-confirm"
                  >
                    Add
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
