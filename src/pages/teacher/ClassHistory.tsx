import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDateTime } from "@/lib/crmUtils";
import { Loader, Calendar } from "lucide-react";
import { useTeacherDashboard } from "./TeacherDashboard";

export function ClassHistory() {
  const { classes, courses, students, loading } = useTeacherDashboard();
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredClasses = useMemo(() => {
    return (classes || []).filter(c => 
      statusFilter === "all" || c.status === statusFilter
    );
  }, [classes, statusFilter]);

  const getCourseSubject = (id: string) => courses.find(c => c.courseId === id)?.subject || "N/A";
  const getStudentName = (id: string) => students.find(s => s.studentId === id)?.name || "N/A";

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader className="animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><Calendar /> Class History</h1>
          <p className="text-muted-foreground">View your past and upcoming classes.</p>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Scheduled">Scheduled</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-muted/50 border-b">
              <th className="p-4 font-semibold">Class</th>
              <th className="p-4 font-semibold">Student</th>
              <th className="p-4 font-semibold">Date & Time</th>
              <th className="p-4 font-semibold">Duration</th>
              <th className="p-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredClasses.map(c => (
              <tr key={c.classId} className="border-b last:border-b-0 hover:bg-muted/30 transition-colors">
                <td className="p-4">{getCourseSubject(c.courseId)}</td>
                <td className="p-4">{getStudentName(c.studentId)}</td>
                <td className="p-4">{formatDateTime(c.startDateTime)}</td>
                <td className="p-4">{c.durationMinutes} mins</td>
                <td className="p-4"><StatusBadge status={c.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && filteredClasses.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No classes found for the selected filter.
          </div>
        )}
      </div>
    </div>
  );
}