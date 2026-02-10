import { Calendar, Clock, BookOpen, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Progress } from "@/components/ui/progress";
import { classSessions, courses } from "@/data/mockData";

export default function StudentDashboard() {
  const myClasses = classSessions.filter((c) => c.studentId === "s1");
  const todayClasses = myClasses.filter((c) => c.date === "2026-02-10");
  const myCourse = courses.find((c) => c.studentId === "s1");
  const progress = myCourse ? Math.round((myCourse.completedHours / myCourse.totalHours) * 100) : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Student Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Arjun Mehta</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Today's Classes" value={todayClasses.length} icon={Calendar} />
        <StatCard title="Total Classes" value={myClasses.length} subtitle="This cycle" icon={BookOpen} />
        <StatCard title="Hours Completed" value={`${myCourse?.completedHours || 0}h`} icon={Clock} />
        <StatCard title="Progress" value={`${progress}%`} subtitle={`of ${myCourse?.totalHours}h`} icon={TrendingUp} />
      </div>

      {/* Course progress */}
      {myCourse && (
        <div className="rounded-xl bg-card border border-border/50 p-6 shadow-soft">
          <h2 className="font-semibold text-card-foreground mb-4">Course Progress</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{myCourse.name}</span>
              <span className="font-medium text-card-foreground">{myCourse.completedHours}/{myCourse.totalHours}h</span>
            </div>
            <Progress value={progress} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Cycle: {myCourse.cycleType}</span>
              <span>{myCourse.totalHours - myCourse.completedHours}h remaining</span>
            </div>
          </div>
        </div>
      )}

      {/* Schedule */}
      <div className="rounded-xl bg-card border border-border/50 shadow-soft">
        <div className="border-b border-border px-6 py-4">
          <h2 className="font-semibold text-card-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" /> My Schedule
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
                  <p className="font-medium text-card-foreground">{c.subject}</p>
                  <p className="text-sm text-muted-foreground">{c.teacherName} · {c.time} · {c.duration}h</p>
                </div>
              </div>
              <StatusBadge status={c.status} />
            </div>
          )) : (
            <div className="px-6 py-8 text-center text-muted-foreground">No classes scheduled for today.</div>
          )}
        </div>
      </div>

      {/* History */}
      <div className="rounded-xl bg-card border border-border/50 shadow-soft overflow-hidden">
        <div className="border-b border-border px-6 py-4">
          <h2 className="font-semibold text-card-foreground">Class History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Teacher</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {myClasses.map((c) => (
                <tr key={c.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-card-foreground">{c.date}</td>
                  <td className="px-6 py-4 text-sm text-card-foreground">{c.subject}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{c.teacherName}</td>
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
