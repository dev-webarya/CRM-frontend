import { useState, useMemo, useEffect } from "react";
import { Plus, Edit, Trash2, Search, Loader } from "lucide-react";
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
import { Teacher } from "@/types/types";
import { formatDate, validateTeacher } from "@/lib/crmUtils";
import { teacherAPI, APIError } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function TeachersManagement() {
  const { user } = useAuth();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Teacher>>({});
  const [errors, setErrors] = useState<string[]>([]);

  const adminId = user?._id || "system";

  // Fetch teachers from API
  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await teacherAPI.getAll(1, 100);
      setTeachers(response.data || []);
    } catch (error) {
      console.error("Failed to fetch teachers:", error);
      setErrors(["Failed to load teachers. Please try again."]);
    } finally {
      setLoading(false);
    }
  };

  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) => {
      const matchesSearch =
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.mobile.includes(searchTerm);
      const matchesStatus = statusFilter === "all" || t.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [teachers, searchTerm, statusFilter]);

  const handleAddClick = () => {
    setEditingId(null);
    setFormData({
      status: "Active",
      subjects: [],
      compensationPerHour: 0,
    });
    setErrors([]);
    setOpen(true);
  };

  const handleEditClick = (teacher: Teacher) => {
    setEditingId(teacher.teacherId);
    setFormData(teacher);
    setErrors([]);
    setOpen(true);
  };

  const handleSave = async () => {
    const validation = validateTeacher(formData);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        // Update existing
        const updateData = {
          ...formData,
          updatedBy: adminId,
        };
        await teacherAPI.update(editingId, updateData);
        
        // Refresh the list
        await fetchTeachers();
      } else {
        // Create new
        const createData = {
          ...formData,
          password: formData.mobile, // Initial password is the 10-digit mobile number
          createdBy: adminId,
        };
        const response = await teacherAPI.create(createData);
        
        // Refresh the list
        await fetchTeachers();
      }

      setOpen(false);
      setFormData({});
    } catch (error) {
      console.error("Error saving teacher:", error);
      if (error instanceof APIError) {
        setErrors(error.message ? [error.message] : ["Failed to save teacher. Please try again."]);
      } else {
        setErrors(["Failed to save teacher. Please try again."]);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const teacher = teachers.find((t) => t.teacherId === id);
    if (teacher && window.confirm(`Delete ${teacher.name}?`)) {
      setDeleting(id);
      try {
        await teacherAPI.delete(id, { deletedBy: adminId });
        
        // Refresh the list
        await fetchTeachers();
      } catch (error) {
        console.error("Failed to delete teacher:", error);
        setErrors(["Failed to delete teacher. Please try again."]);
      } finally {
        setDeleting(null);
      }
    }
  };

  const addSubject = (subject: string) => {
    if (subject && !formData.subjects?.includes(subject)) {
      setFormData({
        ...formData,
        subjects: [...(formData.subjects || []), subject],
      });
    }
  };

  const removeSubject = (subject: string) => {
    setFormData({
      ...formData,
      subjects: formData.subjects?.filter((s) => s !== subject) || [],
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Teachers Management</h1>
          <p className="text-muted-foreground">Manage teachers and their details</p>
        </div>
        <Button onClick={handleAddClick} className="gap-2" disabled={loading}>
          <Plus className="h-4 w-4" />
          Add Teacher
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-card border border-border/50 shadow-soft overflow-hidden">
        {loading ? (
          <div className="px-6 py-12 text-center flex items-center justify-center gap-2 text-muted-foreground">
            <Loader className="h-4 w-4 animate-spin" />
            Loading teachers...
          </div>
        ) : (
          <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-muted-foreground">
                Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-muted-foreground">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-muted-foreground">
                Subjects
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-muted-foreground">
                Rate/Hour
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-muted-foreground">
                Joined
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-muted-foreground">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredTeachers.map((teacher) => (
              <tr key={teacher.teacherId} className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-card-foreground">{teacher.name}</p>
                    <p className="text-sm text-muted-foreground">{teacher.teacherId}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-card-foreground">{teacher.email}</td>
                <td className="px-6 py-4 text-sm text-card-foreground">
                  <div className="flex flex-wrap gap-1">
                    {teacher.subjects.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-card-foreground">
                  ₹{teacher.compensationPerHour}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {formatDate(teacher.dateOfJoining)}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={teacher.status === "Active" ? "Active" : "Inactive"} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(teacher)}
                      className="gap-1"
                      disabled={deleting === teacher.teacherId}
                    >
                      <Edit className="h-3 w-3" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(teacher.teacherId)}
                      className="gap-1 text-destructive"
                      disabled={deleting === teacher.teacherId}
                    >
                      {deleting === teacher.teacherId ? (
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

        {!loading && filteredTeachers.length === 0 && (
          <div className="px-6 py-12 text-center text-muted-foreground">
            No teachers found
          </div>
        )}
      </div>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Teacher" : "Add New Teacher"}
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
                <Label>Name *</Label>
                <Input
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Full name"
                />
              </div>
              <div>
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="teacher@example.com"
                />
              </div>
              <div>
                <Label>Mobile * (10 digits)</Label>
                <Input
                  value={formData.mobile || ""}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  placeholder="9876543210"
                />
              </div>
              <div>
                <Label>Date of Joining *</Label>
                <Input
                  type="date"
                  value={formData.dateOfJoining || ""}
                  onChange={(e) => setFormData({ ...formData, dateOfJoining: e.target.value })}
                />
              </div>
              <div>
                <Label>Compensation/Hour *</Label>
                <Input
                  type="number"
                  value={formData.compensationPerHour || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      compensationPerHour: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="800"
                />
              </div>
              <div>
                <Label>Compensation/Hour (High)</Label>
                <Input
                  type="number"
                  value={formData.compensationPerHourHigh || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      compensationPerHourHigh: parseFloat(e.target.value) || undefined,
                    })
                  }
                  placeholder="1000"
                />
              </div>
            </div>

            <div>
              <Label>Subjects</Label>
              <div className="flex gap-2">
                <Input
                  id="subjectInput"
                  placeholder="Add subject"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      const input = e.currentTarget;
                      addSubject(input.value);
                      input.value = "";
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById("subjectInput") as HTMLInputElement;
                    addSubject(input.value);
                    input.value = "";
                  }}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.subjects?.map((s) => (
                  <button
                    key={s}
                    onClick={() => removeSubject(s)}
                    className="px-3 py-1 bg-primary/10 text-primary text-sm rounded hover:bg-primary/20"
                  >
                    {s} ✕
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>Status *</Label>
              <Select
                value={formData.status || "Active"}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value as "Active" | "Inactive" })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Notes</Label>
              <Input
                value={formData.notes || ""}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Optional notes"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader className="h-4 w-4 animate-spin mr-2" />}
              {editingId ? "Update" : "Add"} Teacher
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
