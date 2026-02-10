import { courses, teachers, students } from "@/data/mockData";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Plus, Eye } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function CoursesManagement() {
  const getName = (list: { id: string; name: string }[], id: string) => list.find((i) => i.id === id)?.name || "—";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Courses</h1>
          <p className="text-muted-foreground">Assign teachers to students and manage billing cycles.</p>
        </div>
        <Button className="gap-2 gradient-primary border-0 text-primary-foreground"><Plus className="h-4 w-4" /> New Course</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((c) => {
          const progress = Math.round((c.completedHours / c.totalHours) * 100);
          return (
            <div key={c.id} className="rounded-xl bg-card border border-border/50 p-5 shadow-soft transition-shadow hover:shadow-card">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-card-foreground">{c.name}</h3>
                  <p className="text-sm text-muted-foreground">{c.subject}</p>
                </div>
                <StatusBadge status={c.status} />
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Teacher</span>
                  <span className="font-medium text-card-foreground">{getName(teachers, c.teacherId)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Student</span>
                  <span className="font-medium text-card-foreground">{getName(students, c.studentId)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Cycle</span>
                  <span className="font-medium text-card-foreground">{c.cycleType}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Rate</span>
                  <span className="font-medium text-card-foreground">₹{c.billingRate}/hr</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                  <span>Progress</span>
                  <span>{c.completedHours}/{c.totalHours}h ({progress}%)</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              <Button variant="outline" size="sm" className="mt-4 w-full gap-1">
                <Eye className="h-3.5 w-3.5" /> View Details
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
