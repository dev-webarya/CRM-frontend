import { useEffect, useMemo, useState } from "react";
import { Calendar, Clock, DollarSign, Users, BookOpen, Loader } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { useTeacherDashboard } from "./TeacherDashboard";
import { teacherAPI } from "@/lib/api";
import { formatCurrency } from "@/lib/crmUtils";
import { Teacher } from "@/types/types";

export function TeacherHome() {
  const { classes, courses, students, loading, error } = useTeacherDashboard();
  const [teacherProfile, setTeacherProfile] = useState<Teacher | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setProfileLoading(true);
        const resp = await teacherAPI.getMyProfile();
        setTeacherProfile(resp.data || null);
      } catch (e) {
        console.error("Failed to load teacher profile:", e);
      } finally {
        setProfileLoading(false);
      }
    };
    loadProfile();
  }, []);

  const today = new Date().toISOString().split("T")[0];

  const todayClasses = useMemo(() => {
    return (classes || []).filter((c) => c.startDateTime?.startsWith(today));
  }, [classes, today]);

  const monthlySummary = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    let hours = 0;

    for (const cls of classes || []) {
      if (cls.status !== "Completed") continue;
      const d = new Date(cls.startDateTime);
      if (d.getMonth() !== currentMonth || d.getFullYear() !== currentYear) continue;
      hours += (cls.durationMinutes || 0) / 60;
    }

    const rate = teacherProfile?.compensationPerHour || 0;
    const earnings = hours * rate;
    return { hours, rate, earnings };
  }, [classes, teacherProfile]);

  const activeCourses = useMemo(() => (courses || []).filter((c) => c.status === "Active").length, [courses]);

  if (loading || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Teacher Dashboard</h1>
        <p className="text-muted-foreground">Your classes, students, and earnings based on real recorded data.</p>
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Today's Classes" value={todayClasses.length} icon={Calendar} />
        <StatCard title="My Students" value={students?.length || 0} subtitle="Active roster" icon={Users} />
        <StatCard title="Active Courses" value={activeCourses} icon={BookOpen} />
        <StatCard
          title="This Month"
          value={`${monthlySummary.hours.toFixed(1)} hrs`}
          subtitle={formatCurrency(monthlySummary.earnings)}
          icon={DollarSign}
        />
      </div>

      <div className="rounded-xl bg-card border border-border/50 shadow-soft">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="font-semibold text-card-foreground flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" /> Today's Schedule
          </h2>
          <span className="text-sm text-muted-foreground">{today}</span>
        </div>
        <div className="divide-y divide-border">
          {todayClasses.length === 0 ? (
            <div className="px-6 py-8 text-center text-muted-foreground">No classes scheduled for today.</div>
          ) : (
            todayClasses.map((c) => {
              const course = courses.find((co) => co.courseId === c.courseId);
              const student = students.find((s) => s.studentId === c.studentId);
              return (
                <div key={c.classId} className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <BookOpen className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground">{course?.subject || c.courseId}</p>
                      <p className="text-sm text-muted-foreground">{student?.name || c.studentId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      {new Date(c.startDateTime).toLocaleTimeString()} · {c.durationMinutes}m
                    </span>
                    <StatusBadge status={c.status} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="rounded-xl bg-card border border-border/50 shadow-soft">
        <div className="border-b border-border px-6 py-4">
          <h2 className="font-semibold text-card-foreground">Quick Summary</h2>
        </div>
        <div className="px-6 py-6 grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Rate / Hour</p>
            <p className="text-lg font-semibold">{formatCurrency(monthlySummary.rate)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Completed (This Month)</p>
            <p className="text-lg font-semibold">{monthlySummary.hours.toFixed(1)} hours</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Estimated Earnings</p>
            <p className="text-lg font-semibold">{formatCurrency(monthlySummary.earnings)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

