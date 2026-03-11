import { useEffect, useMemo, useState } from "react";
import { formatCurrency } from "@/lib/crmUtils";
import { Loader, DollarSign } from "lucide-react";
import { useTeacherDashboard } from "./TeacherDashboard";
import { payrollAPI, teacherAPI } from "@/lib/api";
import { Teacher } from "@/types/types";

export function Earnings() {
  const { classes, courses, user, loading } = useTeacherDashboard();
  const [teacherProfile, setTeacherProfile] = useState<Teacher | null>(null);
  const [payrolls, setPayrolls] = useState<any[]>([]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const resp = await teacherAPI.getMyProfile();
        setTeacherProfile(resp.data || null);
      } catch (e) {
        // If profile fetch fails, keep null and fall back to default rate
        console.error("Failed to load teacher profile:", e);
      }
    };

    if (user?.role === "teacher") {
      loadProfile();
    }
  }, [user]);

  useEffect(() => {
    const loadPayrolls = async () => {
      try {
        const resp = await payrollAPI.getTeacherPayroll();
        setPayrolls(resp.data || []);
      } catch (e) {
        console.error("Failed to load payroll history:", e);
      }
    };

    if (user?.role === "teacher") {
      loadPayrolls();
    }
  }, [user]);

  const monthlyEarnings = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyClasses = (classes || []).filter((c) => {
      const d = new Date(c.startDateTime);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear && c.status === "Completed";
    });

    let totalEarnings = 0;
    const breakdown: any[] = [];

    monthlyClasses.forEach((c) => {
      const course = courses.find((co) => co.courseId === c.courseId);
      const teacherRate = teacherProfile?.compensationPerHour || 0;
      const earning = (c.durationMinutes / 60) * teacherRate;
      totalEarnings += earning;
      breakdown.push({ ...c, earning, courseSubject: course?.subject || "N/A" });
    });

    return { totalEarnings, breakdown };
  }, [classes, courses, teacherProfile]);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader className="animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><DollarSign /> Monthly Earnings</h1>
          <p className="text-muted-foreground">Your estimated earnings for the current month.</p>
        </div>
      </div>

      <div className="bg-card border rounded-xl p-6 shadow-sm">
        <p className="text-muted-foreground">This Month's Total</p>
        <p className="text-4xl font-bold">{formatCurrency(monthlyEarnings.totalEarnings)}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Rate: {teacherProfile ? formatCurrency(teacherProfile.compensationPerHour) : "—"} / hour
        </p>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <h3 className="p-4 font-semibold border-b">Payroll History</h3>
        {payrolls.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No payroll records yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-muted/50 border-b">
                  <th className="p-4 font-semibold">Month</th>
                  <th className="p-4 font-semibold">Hours</th>
                  <th className="p-4 font-semibold">Net</th>
                  <th className="p-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {payrolls.map((p) => (
                  <tr key={p._id} className="border-b last:border-b-0 hover:bg-muted/30 transition-colors">
                    <td className="p-4">{p.billingMonth}</td>
                    <td className="p-4">{Number(p.totalHoursTaught || 0).toFixed(1)}</td>
                    <td className="p-4">{formatCurrency(p.netAmount || 0)}</td>
                    <td className="p-4 capitalize">{p.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <h3 className="p-4 font-semibold border-b">Earnings Breakdown</h3>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-muted/50 border-b">
              <th className="p-4 font-semibold">Class</th>
              <th className="p-4 font-semibold">Duration</th>
              <th className="p-4 font-semibold">Earning</th>
            </tr>
          </thead>
          <tbody>
            {monthlyEarnings.breakdown.map(item => (
              <tr key={item.classId} className="border-b last:border-b-0 hover:bg-muted/30 transition-colors">
                <td className="p-4">{item.courseSubject}</td>
                <td className="p-4">{item.durationMinutes} mins</td>
                <td className="p-4">{formatCurrency(item.earning)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {monthlyEarnings.breakdown.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No completed classes this month.
          </div>
        )}
      </div>
    </div>
  );
}