import { useMemo } from "react";
import { useTeacherDashboard } from "./TeacherDashboard";
import { Loader, User, Book, Users } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";

export function MyStudents() {
  const { students, courses, loading } = useTeacherDashboard();

  const getCourseNameForStudent = (studentId: string) => {
    const course = (courses || []).find(c => c.studentId === studentId && c.status === "Active");
    return course?.subject || "No active course";
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader className="animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><Users /> My Students</h1>
          <p className="text-muted-foreground">A list of your currently assigned students.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(students || []).map(student => (
          <div key={student.studentId} className="bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-card-foreground flex items-center gap-2"><User size={20} /> {student.name}</h3>
                <p className="text-sm text-muted-foreground">{student.studentId}</p>
              </div>
              <StatusBadge status={student.status} />
            </div>
            <div className="mt-4 border-t pt-4">
              <div className="flex items-center gap-2 text-sm">
                <Book size={16} className="text-muted-foreground" />
                <span className="font-medium">Course:</span>
                <span>{getCourseNameForStudent(student.studentId)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!loading && students.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          You have no students assigned.
        </div>
      )}
    </div>
  );
}