import { useState } from "react";
import { useMe } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { ChevronLeft, ChevronRight, Calendar, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";

export default function Timesheet() {
  const { data: user, isLoading } = useMe();
  const [currentWeek, setCurrentWeek] = useState(new Date(2026, 2, 16)); // Mar 16, 2026
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState("Select client");
  const [selectedProject, setSelectedProject] = useState("Select project");

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
          {/* Center Panel */}
          <div className="flex-1">
            <div className="bg-white rounded-lg p-12 shadow-sm flex items-center justify-center min-h-96">
              <p className="text-slate-500 text-center text-lg">
                No time sheets found for this week range
              </p>
            </div>
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
                  {/* Days 1-31 */}
                  {Array.from({ length: 31 }).map((_, i) => {
                    const date = i + 1;
                    let bgColor = "bg-white hover:bg-slate-50";

                    // Color indicators
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
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
                  <div key={day} className="text-center">
                    <p className="text-xs text-slate-600 font-medium">{day}</p>
                    <p className="text-sm font-semibold text-slate-900">0h</p>
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
            <div className="bg-white rounded-lg p-8 shadow-lg max-w-md w-full">
              <h2 className="text-xl font-bold text-slate-900 mb-6">March 2026</h2>

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
                    let bgColor = "bg-white hover:bg-slate-50 border border-slate-200";

                    if ([4, 5, 6, 7, 8].includes(date)) bgColor = "bg-green-100 border border-green-200";
                    if ([11, 12, 13].includes(date)) bgColor = "bg-yellow-100 border border-yellow-200";
                    if ([18, 19, 20].includes(date)) bgColor = "bg-red-100 border border-red-200";
                    if ([25, 26, 27, 28].includes(date)) bgColor = "bg-blue-100 border border-blue-200";

                    return (
                      <div
                        key={date}
                        className={`h-10 flex items-center justify-center text-sm font-medium rounded cursor-pointer ${bgColor} text-slate-900`}
                      >
                        {date}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status Legend */}
              <div className="border-t pt-4 space-y-2 mb-6">
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
            <div className="bg-white rounded-lg p-8 shadow-lg max-w-md w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900">Add new project</h2>
                <button
                  onClick={() => setShowAddProjectModal(false)}
                  className="p-1 hover:bg-slate-100 rounded"
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
                  <div className="relative">
                    <select
                      value={selectedClient}
                      onChange={(e) => setSelectedClient(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="Select client">Select client</option>
                      <option value="NovintiX">NovintiX</option>
                    </select>
                  </div>
                </div>

                {/* Project Name Dropdown */}
                <div>
                  <label className="text-xs uppercase font-semibold text-slate-600 block mb-2">
                    Project Name
                  </label>
                  <div className="relative">
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

                {/* Buttons */}
                <div className="flex gap-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddProjectModal(false)}
                    className="flex-1 border-slate-300 text-slate-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      // Handle add project
                      setShowAddProjectModal(false);
                      setSelectedClient("Select client");
                      setSelectedProject("Select project");
                    }}
                    className="flex-1 bg-primary text-white hover:bg-primary/90"
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
