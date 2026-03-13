import { useState } from "react";
import { useMe } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { ChevronLeft, ChevronRight, Search, X, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";

/* ─── Types ──────────────────────────────────────────────── */
interface LeaveRequest {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  status: "Approved" | "Pending" | "Rejected";
  appliedOn: string;
  comments?: string;
}

interface Holiday {
  name: string;
  date: string;
  type: "government" | "flex";
}

const LEAVE_TYPES = [
  "Earned Leave",
  "Sick Leave",
  "Casual Leave",
  "Flex Leave",
  "Compensatory Off",
];

const STATUS_OPTIONS = ["Approved", "Pending", "Rejected"] as const;

const HEADER_COLOR = "#0F3D57";

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string; calBg: string; calText: string }> = {
  Approved: { bg: "bg-blue-50",   text: "text-blue-700",   dot: "#22c55e", calBg: "#dbeafe", calText: "#1d4ed8" },
  Pending:  { bg: "bg-yellow-50", text: "text-yellow-700", dot: "#eab308", calBg: "#fef9c3", calText: "#854d0e" },
  Rejected: { bg: "bg-red-50",   text: "text-red-600",    dot: "#ef4444", calBg: "#fee2e2", calText: "#b91c1c" },
};

const UPCOMING_HOLIDAYS: Holiday[] = [
  { name: "Ugadi",                      date: "Mar 19", type: "government" },
  { name: "Id-ul-Fitr (Ramzan)",        date: "Mar 31", type: "government" },
  { name: "Good Friday",                date: "Apr 3",  type: "government" },
  { name: "Dr. B.R. Ambedkar Jayanti", date: "Apr 14", type: "government" },
  { name: "Flex Friday",               date: "Apr 10", type: "flex" },
  { name: "Flex Day",                  date: "May 2",  type: "flex" },
];

/* ─── Mini Calendar ─────────────────────────────────────── */
function parseDate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

const MONTH_MAP: Record<string, number> = {
  Jan:0, Feb:1, Mar:2, Apr:3, May:4, Jun:5, Jul:6, Aug:7, Sep:8, Oct:9, Nov:10, Dec:11,
};

function parseHolidayDate(s: string, y: number): Date {
  const [mon, day] = s.split(" ");
  return new Date(y, MONTH_MAP[mon], parseInt(day));
}

function MiniCalendar({
  referenceDate,
  leaveDates,
  holidays = [],
}: {
  referenceDate: Date;
  leaveDates: { start: string; end: string; status: string }[];
  holidays?: Holiday[];
}) {
  const [viewDate, setViewDate] = useState(new Date(referenceDate));
  const year  = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const dayLabels  = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const rawFirst   = new Date(year, month, 1).getDay();
  const firstCell  = rawFirst === 0 ? 6 : rawFirst - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  interface DayInfo {
    leaveStatus: string | null;
    holidayType: "government" | "flex" | null;
  }

  const getDayInfo = (day: number): DayInfo => {
    const d = new Date(year, month, day);
    for (const lr of leaveDates) {
      const s = parseDate(lr.start);
      const e = parseDate(lr.end);
      s.setHours(0,0,0,0); e.setHours(23,59,59,999);
      if (d >= s && d <= e) return { leaveStatus: lr.status, holidayType: null };
    }
    for (const h of holidays) {
      const hd = parseHolidayDate(h.date, year);
      if (hd.getDate() === day && hd.getMonth() === month)
        return { leaveStatus: null, holidayType: h.type };
    }
    return { leaveStatus: null, holidayType: null };
  };

  const isToday = (day: number) =>
    today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;

  const cells: (number | null)[] = [
    ...Array(firstCell).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => { const d = new Date(viewDate); d.setMonth(d.getMonth() - 1); setViewDate(d); }}
          className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-slate-500" />
        </button>
        <span className="text-sm font-bold text-slate-800">{monthNames[month]} {year}</span>
        <button
          onClick={() => { const d = new Date(viewDate); d.setMonth(d.getMonth() + 1); setViewDate(d); }}
          className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-1">
        {dayLabels.map(l => (
          <div key={l} className="text-center text-[10px] font-semibold text-slate-400 py-1">{l}</div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, idx) => {
          if (day === null) return <div key={idx} />;
          const col = idx % 7;
          const isWeekend = col === 5 || col === 6;
          const { leaveStatus, holidayType } = getDayInfo(day);
          const st = leaveStatus ? STATUS_STYLES[leaveStatus] : null;
          const todayRing = isToday(day) && !leaveStatus;
          return (
            <div key={idx} className="flex flex-col items-center justify-start gap-0.5 h-10">
              <span
                className={[
                  "w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors",
                  !leaveStatus && isWeekend ? "bg-slate-100 text-slate-400" : "",
                  !leaveStatus && !isWeekend ? "text-slate-600 hover:bg-slate-50" : "",
                  todayRing ? "ring-2 ring-blue-400 ring-offset-1" : "",
                ].join(" ")}
                style={
                  st
                    ? { backgroundColor: st.calBg, color: st.calText }
                    : {}
                }
              >
                {day}
              </span>
              {/* Holiday indicator */}
              {holidayType === "government" && (
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0" />
              )}
              {holidayType === "flex" && (
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Apply Leave Modal ──────────────────────────────────── */
function ApplyLeaveModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (req: Omit<LeaveRequest, "id" | "appliedOn" | "status">) => void;
}) {
  const [type, setType]       = useState("");
  const [startDate, setStart] = useState("");
  const [endDate, setEnd]     = useState("");
  const [reason, setReason]   = useState("");
  const [error, setError]     = useState("");

  const calcDays = () => {
    if (!startDate || !endDate) return 0;
    const diff = (parseDate(endDate).getTime() - parseDate(startDate).getTime()) / 86400000;
    return diff >= 0 ? diff + 1 : 0;
  };

  const handleSubmit = () => {
    if (!type || !startDate || !endDate) { setError("Please fill in all required fields."); return; }
    if (parseDate(endDate) < parseDate(startDate)) { setError("End date must be on or after start date."); return; }
    onSubmit({ type, startDate, endDate, days: calcDays() });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" data-testid="modal-apply-leave">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4" style={{ backgroundColor: "#0F3D57" }}>
          <h2 className="text-lg font-bold text-white">Apply Leave</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded" data-testid="button-close-modal">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
        <div className="p-8">

        {error && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-xs uppercase font-semibold text-slate-600 block mb-1.5">Leave Type <span className="text-red-500">*</span></label>
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              data-testid="select-leave-type"
            >
              <option value="">Select leave type</option>
              {LEAVE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase font-semibold text-slate-600 block mb-1.5">From Date <span className="text-red-500">*</span></label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStart(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                data-testid="input-start-date"
              />
            </div>
            <div>
              <label className="text-xs uppercase font-semibold text-slate-600 block mb-1.5">To Date <span className="text-red-500">*</span></label>
              <input
                type="date"
                value={endDate}
                onChange={e => setEnd(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                data-testid="input-end-date"
              />
            </div>
          </div>

          {startDate && endDate && calcDays() > 0 && (
            <p className="text-xs text-slate-500">
              Duration: <span className="font-semibold text-slate-700">{calcDays()} day{calcDays() !== 1 ? "s" : ""}</span>
            </p>
          )}

          <div>
            <label className="text-xs uppercase font-semibold text-slate-600 block mb-1.5">Reason</label>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              rows={3}
              placeholder="Optional reason..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              data-testid="input-reason"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="outline" className="flex-1" onClick={onClose} data-testid="button-cancel">
            Cancel
          </Button>
          <Button
            className="flex-1 text-white"
            style={{ backgroundColor: HEADER_COLOR }}
            onClick={handleSubmit}
            data-testid="button-submit-leave"
          >
            Submit
          </Button>
        </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────── */
export default function LeaveRequest() {
  const { data: user, isLoading } = useMe();

  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [search, setSearch]     = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [typeFilter, setTypeFilter]     = useState("All Types");
  const [showModal, setShowModal]       = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }
  if (!user) return <Redirect to="/" />;

  const handleApply = (req: Omit<LeaveRequest, "id" | "appliedOn" | "status">) => {
    const today = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const appliedOn = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
    const id = `LV-${String(requests.length + 1).padStart(3, "0")}`;
    setRequests(prev => [{ ...req, id, status: "Pending", appliedOn }, ...prev]);
    setShowModal(false);
  };

  const formatDate = (s: string) => {
    const [y, m, d] = s.split("-");
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return `${d} ${months[parseInt(m) - 1]} ${y}`;
  };

  const filtered = requests.filter(r => {
    const matchSearch =
      !search ||
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.type.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All Status" || r.status === statusFilter;
    const matchType   = typeFilter === "All Types" || r.type === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const leaveDates = requests.map(r => ({ start: r.startDate, end: r.endDate, status: r.status }));

  return (
    <DashboardLayout title="Leave Request">
      <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: "28px", alignItems: "start" }}>

        {/* ── LEFT COLUMN (75%) ───────────────────────────────── */}
        <div className="flex flex-col gap-5">

          {/* Controls Row */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by Leave ID or Type..."
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                data-testid="input-search"
              />
            </div>

            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
              data-testid="select-status-filter"
            >
              <option>All Status</option>
              {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
            </select>

            {/* Type filter */}
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
              data-testid="select-type-filter"
            >
              <option>All Types</option>
              {LEAVE_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>

            {/* Apply Leave */}
            <Button
              onClick={() => setShowModal(true)}
              className="text-white ml-auto"
              style={{ backgroundColor: HEADER_COLOR }}
              data-testid="button-apply-leave"
            >
              + Apply Leave
            </Button>
          </div>

          {/* Leave Requests Card */}
          <div className="bg-white rounded-xl shadow-sm" style={{ padding: "24px" }}>
            <h2 className="text-base font-bold text-slate-800 mb-5">My Leave Requests</h2>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                <CalendarDays className="w-10 h-10 mb-3 text-slate-300" />
                <p className="text-sm" data-testid="text-empty-state">
                  No leave requests found matching your filters.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ backgroundColor: HEADER_COLOR }}>
                      {["Leave Type","Start Date","End Date","Days","Status","Applied On","Comments"].map(col => (
                        <th key={col} className="px-4 py-3 text-left text-xs font-semibold text-white whitespace-nowrap">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r, idx) => {
                      const st = STATUS_STYLES[r.status];
                      return (
                        <tr key={r.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"} data-testid={`row-leave-${r.id}`}>
                          <td className="px-4 py-3 font-medium text-slate-800">{r.type}</td>
                          <td className="px-4 py-3 text-slate-600">{formatDate(r.startDate)}</td>
                          <td className="px-4 py-3 text-slate-600">{formatDate(r.endDate)}</td>
                          <td className="px-4 py-3 text-slate-600">{r.days}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${st.bg} ${st.text}`}>
                              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: st.dot }} />
                              {r.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-600">{formatDate(r.appliedOn)}</td>
                          <td className="px-4 py-3 text-slate-500 italic">{r.comments ?? "—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT COLUMN (25%) ──────────────────────────────── */}
        <div className="flex flex-col gap-4">

          {/* Calendar */}
          <div className="bg-white rounded-xl shadow-md p-5">
            <MiniCalendar
              referenceDate={new Date(2026, 2, 1)}
              leaveDates={leaveDates}
              holidays={UPCOMING_HOLIDAYS}
            />
          </div>

          {/* Status Legend */}
          <div className="bg-white rounded-xl shadow-md p-4">
            <h3 className="text-sm font-bold text-slate-800 mb-3">Status Legend</h3>
            <div className="space-y-2.5">
              {(["Approved","Pending","Rejected"] as const).map(s => (
                <div key={s} className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: STATUS_STYLES[s].dot }} />
                  <span className="text-xs text-slate-600">{s}</span>
                </div>
              ))}
              <div className="flex items-center gap-3 pt-1 border-t border-slate-100">
                <span className="w-3 h-3 rounded-full flex-shrink-0 bg-purple-500" />
                <span className="text-xs text-slate-600">Government Holiday</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full flex-shrink-0 bg-orange-500" />
                <span className="text-xs text-slate-600">Flex Holiday</span>
              </div>
            </div>
          </div>

          {/* Upcoming Holidays */}
          <div className="bg-white rounded-xl shadow-md p-4">
            <h3 className="text-sm font-bold text-slate-800 mb-3">Upcoming Holidays</h3>
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {UPCOMING_HOLIDAYS.map(h => (
                <div key={h.name} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {h.type === "government"
                      ? <span className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0" />
                      : <span className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />
                    }
                    <span className="text-xs text-slate-700 font-medium truncate">{h.name}</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">{h.date}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <ApplyLeaveModal onClose={() => setShowModal(false)} onSubmit={handleApply} />
      )}
    </DashboardLayout>
  );
}
