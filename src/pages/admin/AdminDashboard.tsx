import { Calendar, DollarSign, RefreshCw, Users, Clock, BookOpen } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { classSessions, students, courses, teachers } from "@/data/mockData";

export default function AdminDashboard() {
  const todayClasses = classSessions.filter((c) => c.date === "2026-02-10");
  const dueFees = 3;
  const pendingCycles = courses.filter((c) => c.status === "Active" && c.completedHours / c.totalHours > 0.8).length;
  const monthlyPayout = teachers.reduce((sum, t) => sum + t.monthlyHours * t.rate, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your institute today.</p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Today's Classes" value={todayClasses.length} subtitle="3 scheduled, 1 completed" icon={Calendar} />
        <StatCard title="Due Fees" value={dueFees} subtitle="₹45,000 pending" icon={DollarSign} trend={{ value: "2 overdue", positive: false }} />
        <StatCard title="Pending Cycles" value={pendingCycles} subtitle="Nearing completion" icon={RefreshCw} />
        <StatCard title="Monthly Payout" value={`₹${(monthlyPayout / 1000).toFixed(0)}K`} subtitle="For all teachers" icon={Users} />
      </div>

      {/* Today's Classes */}
      <div className="rounded-xl bg-card border border-border/50 shadow-soft">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="font-semibold text-card-foreground flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" /> Today's Classes
          </h2>
          <span className="text-sm text-muted-foreground">Feb 10, 2026</span>
        </div>
        <div className="divide-y divide-border">
          {todayClasses.map((c) => (
            <div key={c.id} className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-card-foreground">{c.subject}</p>
                  <p className="text-sm text-muted-foreground">{c.teacherName} → {c.studentName}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">{c.time} · {c.duration}h</span>
                <StatusBadge status={c.status} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent students */}
      <div className="rounded-xl bg-card border border-border/50 shadow-soft">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="font-semibold text-card-foreground flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" /> Recent Students
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Reg. No</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {students.slice(0, 5).map((s) => (
                <tr key={s.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-card-foreground">{s.name}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{s.regNumber}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{s.course}</td>
                  <td className="px-6 py-4"><StatusBadge status={s.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
