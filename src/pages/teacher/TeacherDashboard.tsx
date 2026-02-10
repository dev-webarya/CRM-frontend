import { Calendar, Clock, Users, DollarSign, Plus, BookOpen } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { classSessions, students } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

export default function TeacherDashboard() {
  const { toast } = useToast();
  const myClasses = classSessions.filter((c) => c.teacherId === "t1");
  const todayClasses = myClasses.filter((c) => c.date === "2026-02-10");
  const myStudents = students.filter((s) => s.assignedTeacher === "t1");
  const monthlyHours = 48;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Teacher Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Dr. Ananya Sharma</p>
        </div>
        <Button className="gap-2 gradient-primary border-0 text-primary-foreground" onClick={() => toast({ title: "Add Class dialog would open" })}>
          <Plus className="h-4 w-4" /> Add Class
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Today's Classes" value={todayClasses.length} icon={Calendar} />
        <StatCard title="My Students" value={myStudents.length} icon={Users} />
        <StatCard title="Monthly Hours" value={`${monthlyHours}h`} subtitle="This month" icon={Clock} />
        <StatCard title="Earnings" value={`₹${(monthlyHours * 800).toLocaleString()}`} subtitle="This month" icon={DollarSign} />
      </div>

      {/* Today's schedule */}
      <div className="rounded-xl bg-card border border-border/50 shadow-soft">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="font-semibold text-card-foreground flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" /> Today's Schedule
          </h2>
        </div>
        <div className="divide-y divide-border">
          {todayClasses.length > 0 ? todayClasses.map((c) => (
            <div key={c.id} className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-card-foreground">{c.subject} - {c.studentName}</p>
                  <p className="text-sm text-muted-foreground">{c.time} · {c.duration}h</p>
                </div>
              </div>
              <StatusBadge status={c.status} />
            </div>
          )) : (
            <div className="px-6 py-8 text-center text-muted-foreground">No classes scheduled for today.</div>
          )}
        </div>
      </div>

      {/* Assigned Students */}
      <div className="rounded-xl bg-card border border-border/50 shadow-soft">
        <div className="border-b border-border px-6 py-4">
          <h2 className="font-semibold text-card-foreground flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" /> My Students
          </h2>
        </div>
        <div className="divide-y divide-border">
          {myStudents.map((s) => (
            <div key={s.id} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="font-medium text-card-foreground">{s.name}</p>
                <p className="text-sm text-muted-foreground">{s.course} · {s.grade}</p>
              </div>
              <StatusBadge status={s.status} />
            </div>
          ))}
        </div>
      </div>

      {/* Class History */}
      <div className="rounded-xl bg-card border border-border/50 shadow-soft overflow-hidden">
        <div className="border-b border-border px-6 py-4">
          <h2 className="font-semibold text-card-foreground">Recent Class History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {myClasses.map((c) => (
                <tr key={c.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-card-foreground">{c.date}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{c.studentName}</td>
                  <td className="px-6 py-4 text-sm text-card-foreground">{c.subject}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{c.duration}h</td>
                  <td className="px-6 py-4"><StatusBadge status={c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
