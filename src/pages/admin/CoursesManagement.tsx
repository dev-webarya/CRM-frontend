import { useState, useMemo, useEffect } from "react";
import { Plus, Edit, Trash2, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/StatusBadge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Course, Student, Teacher } from "@/types/types";
import { formatDate, validateCourse } from "@/lib/crmUtils";
import { courseAPI, studentAPI, teacherAPI, APIError } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const cycleTypeOptions = ["6hrs", "8hrs", "12hrs", "16hrs", "monthly"];

export default function CoursesManagement() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingRefs, setLoadingRefs] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Course>>({});
  const [errors, setErrors] = useState<string[]>([]);

  const adminId = user?._id || "system";

  useEffect(() => {
    fetchCourses();
    fetchStudentsAndTeachers();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await courseAPI.getAll(1, 100);
      setCourses(response.data || []);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      setErrors(["Failed to load courses. Please try again."]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentsAndTeachers = async () => {
    try {
      setLoadingRefs(true);
      const [studentRes, teacherRes] = await Promise.all([
        studentAPI.getAll(1, 200, { status: "Active" }),
        teacherAPI.getAll(1, 100, { status: "Active" }),
      ]);
      setStudents(studentRes.data || []);
      setTeachers(teacherRes.data || []);
    } catch (error) {
      console.error("Failed to fetch students/teachers:", error);
    } finally {
      setLoadingRefs(false);
    }
  };

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const student = students.find(s => s.studentId === c.studentId);
      const teacher = teachers.find(t => t.teacherId === c.teacherId);
      
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        c.subject.toLowerCase().includes(searchLower) ||
        c.courseId.toLowerCase().includes(searchLower) ||
        student?.name.toLowerCase().includes(searchLower) ||
        teacher?.name.toLowerCase().includes(searchLower);
      
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [courses, students, teachers, searchTerm, statusFilter]);

  const handleAddClick = () => {
    setEditingId(null);
    setFormData({
      status: "Active",
      startDate: new Date().toISOString().split("T")[0],
      cycleType: "12hrs",
      billingRatePerHour: 500,
    });
    setErrors([]);
    setOpen(true);
  };

  const handleEditClick = (course: Course) => {
    setEditingId(course.courseId);
    setFormData({ ...course });
    setErrors([]);
    setOpen(true);
  };

  const handleSave = async () => {
    const { valid, errors: validationErrors } = validateCourse(formData);
    if (!valid) {
      setErrors(validationErrors);
      return;
    }

    setSaving(true);
    setErrors([]);

    try {
      if (editingId) {
        await courseAPI.update(editingId, { ...formData, updatedBy: adminId });
      } else {
        await courseAPI.create({ ...formData, createdBy: adminId });
      }
      await fetchCourses();
      setOpen(false);
    } catch (error) {
      console.error("Error saving course:", error);
      if (error instanceof APIError) {
        setErrors([error.message || "Failed to save course."]);
      } else {
        setErrors(["An unexpected error occurred."]);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(`Are you sure you want to delete course ${id}?`)) {
      setDeleting(id);
      try {
        await courseAPI.delete(id, { deletedBy: adminId });
        await fetchCourses();
      } catch (error) {
        console.error("Failed to delete course:", error);
        setErrors(["Failed to delete course."]);
      } finally {
        setDeleting(null);
      }
    }
  };

  const getStudentName = (id: string) => students.find(s => s.studentId === id)?.name || id;
  const getTeacherName = (id: string) => teachers.find(t => t.teacherId === id)?.name || id;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Courses Management</h1>
          <p className="text-muted-foreground">Manage student course enrollments</p>
        </div>
        <Button onClick={handleAddClick} className="gap-2" disabled={loading || loadingRefs}>
          <Plus className="h-4 w-4" />
          Add Course
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by subject, student, or teacher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Paused">Paused</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-card border border-border/50 shadow-soft overflow-hidden">
        {loading ? (
          <div className="px-6 py-12 text-center text-muted-foreground">
            <Loader className="h-8 w-8 animate-spin mx-auto mb-4" />
            Loading courses...
          </div>
        ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Course</th>
              <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Student</th>
              <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Teacher</th>
              <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Start Date</th>
              <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredCourses.map((course) => (
              <tr key={course.courseId} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-card-foreground">{course.subject}</span>
                    <span className="text-xs text-muted-foreground">{course.courseId}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-card-foreground">{getStudentName(course.studentId)}</td>
                <td className="px-6 py-4 text-sm text-card-foreground">{getTeacherName(course.teacherId)}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{formatDate(course.startDate)}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={course.status} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(course)}
                      className="gap-1"
                      disabled={deleting === course.courseId}
                    >
                      <Edit className="h-3 w-3" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(course.courseId)}
                      className="gap-1 text-destructive"
                      disabled={deleting === course.courseId}
                    >
                      {deleting === course.courseId ? (
                        <Loader className="h-3 w-3 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}

        {!loading && filteredCourses.length === 0 && (
          <div className="px-6 py-12 text-center text-muted-foreground">
            No courses found
          </div>
        )}
      </div>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Course" : "Add New Course"}
            </DialogTitle>
          </DialogHeader>

          {errors.length > 0 && (
            <div className="bg-destructive/10 border border-destructive/50 rounded p-3 text-sm text-destructive">
              <ul className="list-disc pl-5">
                {errors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Student *</Label>
                <Select
                  value={formData.studentId || ""}
                  onValueChange={(value) => setFormData({ ...formData, studentId: value })}
                  disabled={loadingRefs || !!editingId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((s) => (
                      <SelectItem key={s.studentId} value={s.studentId}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Teacher *</Label>
                <Select
                  value={formData.teacherId || ""}
                  onValueChange={(value) => setFormData({ ...formData, teacherId: value })}
                  disabled={loadingRefs}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((t) => (
                      <SelectItem key={t.teacherId} value={t.teacherId}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label>Subject *</Label>
                <Input
                  value={formData.subject || ""}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g., Grade 10 Mathematics"
                />
              </div>
              <div>
                <Label>Start Date *</Label>
                <Input
                  type="date"
                  value={formData.startDate || ""}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label>Billing Rate (per Hour) *</Label>
                <Input
                  type="number"
                  value={formData.billingRatePerHour || ""}
                  onChange={(e) => setFormData({ ...formData, billingRatePerHour: parseFloat(e.target.value) || 0 })}
                  placeholder="e.g., 800"
                />
              </div>
              <div>
                <Label>Cycle Type *</Label>
                <Select
                  value={formData.cycleType || ""}
                  onValueChange={(value) => setFormData({ ...formData, cycleType: value as "6hrs" | "8hrs" | "12hrs" | "16hrs" | "monthly" })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select cycle type" />
                  </SelectTrigger>
                  <SelectContent>
                    {cycleTypeOptions.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status *</Label>
                <Select
                  value={formData.status || "Active"}
                  onValueChange={(value) => setFormData({ ...formData, status: value as Course['status'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Paused">Paused</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader className="h-4 w-4 animate-spin mr-2" />}
              {editingId ? "Update" : "Add"} Course
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}